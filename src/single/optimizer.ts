import Optimizer from './Optimizer';
import { parse } from '../parser'
import { Message, Report, Result } from '../Result';
import { IOptions, prepare as prepareOptions  } from '../options'
import { mask } from '../global'
import { class_Dfr } from 'atma-utils'
import { prepare as preparePlugins } from '../plugins'


export interface IOptimizer {
    (node: any, ctx: OptimizerCtx, next: INext)
    middleware: string
}
export interface INext {
    (node?: any)
}

export interface IOptimizerCollection {
    name: string
    fns: IOptimizer[]
    priorities: string[]
}

export class OptimizerCtx {
    public middleware: string
    constructor(public report: Report, public filename: string, public source: string) {

    }
    error (text: string, node?) {
        this.write(text, node, 'error');
    }
    info (text: string, node?) {
        this.write(text, node, 'info');
    }
    warn (text: string, node?) {
        this.write(text, node, 'warn');
    }
    private write(text: string, node = null, level: 'error' | 'warn' | 'info') {
        let message = new Message;
        message.message = text;
        message.source = this.source;
        message.filename = this.filename;
        message.middleware = this.middleware
        message.level = level;
        if (node && node.sourceIndex) {
            let before = this.source.substring(0, node.sourceIndex);
            let lines = before.split(/\r?\n/g);
            message.line = lines.length;
            message.col = lines[lines.length - 1].length;
        }
        
        switch (level) {
            case 'error':
                this.report.errors.push(message)
                break;
            case 'warn':
                this.report.warnings.push(message)
                break;            
        }
    }
}


export class OptimizerCtor {
    optimizers: { [name: string]: IOptimizerCollection } = {}; 

    public async optimizeAsync (source: string, path: string, opts?: IOptions): Promise<Result> {

        const options = prepareOptions(opts);
		preparePlugins(path, options);

        let result = parse(source, path);
        let root = result.result;
        let optimizerResult = new Result();
        let ctx = new OptimizerCtx(result.report, path, source);

        root = await this.processOptimizers(root, ctx, this.getOptimizers('*:before')) || root;
        root = await this.processTags(root, ctx) || root;
        root = await this.processOptimizers(root, ctx, this.getOptimizers('*:after')) || root; 
        
        let indent = options.minify ? 0 : 4;
        let str = <string>mask.stringify(root, { indent: indent });
        
        let out = new Result();
        out.report = ctx.report;
        out.result = str;
        return out;
    }
        
    /**
     * 
     * @param pattern eg. 'style';`*` ~ `*:before`, `*:after`
     * @param fn 
     */
    public registerOptimizer (pattern: string, fn: IOptimizer, middleware?: string) {
        let name = pattern;
        let optimizers = this.optimizers[name];
        if (optimizers == null) {
            optimizers = { name, fns: [], priorities: [] };
            this.optimizers[name] = optimizers;
        }
        fn.middleware = middleware;    
        optimizers.fns.push(fn);
    }
    public removeOptimizer () {
        this.optimizers = {};
    }
    public getOptimizers (name): IOptimizer[] {
        let optimizers = this.optimizers[name];
        if (optimizers == null) {
            return null;
        }
        return optimizers.fns;
    }

    private processTags (root, ctx: OptimizerCtx): Promise<any> {
        let dfr = new class_Dfr();
        mask.TreeWalker.walkAsync(
            root
            , (node, next) => {
                var fns = this.getOptimizers(node.tagName);
                if (fns != null) {
                    this.processOptimizers(node, ctx, fns).then(next);
                    return;
                }
                next();
            }
            , (root) => {
                dfr.resolve(root)
            }
        );
        return dfr as any;
    } 
    private processOptimizers(node, ctx: OptimizerCtx, fns: IOptimizer[]): Promise<any> {
        let dfr = new class_Dfr();
        if (fns == null || fns.length === 0) {
            dfr.resolve();
            return dfr as any;
        }
        let i = -1;
        let result = null;    
    
        function process () {
            if (++i >= fns.length) {
                dfr.resolve(result);
                return;
            }
    
            let fn = fns[i];        
            ctx.middleware = fn.middleware;
            fn(node, ctx, function ($result) {
                result = $result;
                process();
            });
        }
        process();
        return dfr as any;
    }
}


export default new OptimizerCtor;
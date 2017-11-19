import { parse } from '../parser'
import { Report, Result } from '../Result'
import { IOptions, prepare as prepareOptions  } from '../options'
import { mask } from '../global'
import { class_Dfr } from 'atma-utils'
import { prepare as preparePlugins } from '../plugins'


export interface IContext {
    report: Report
}

export interface IOptimizer {
    (node: any, ctx: IContext, next: INext)
}
export interface INext {
    (node?: any)
}

export interface IOptimizerCollection {
    name: string
    fns: IOptimizer[]
    priorities: string[]
}


export class OptimizerCtor {
    optimizers: { [name: string]: IOptimizerCollection } = {}; 

    public async optimizeAsync (source: string, path: string, opts?: IOptions): Promise<Result> {

        const options = prepareOptions(opts);
		preparePlugins(path, options);

        let result = parse(source, path);
        let root = result.result;
        let optimizerResult = new Result();
        let ctx = { report: result.report };
        
    
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
    public registerOptimizer (pattern: string, fn: IOptimizer) {
        // let rgx = /^([^:]+)(:(.+))?$/;
        // let match = rgx.exec(pattern);
        // let name = match[1];
        // let priorety = match[3] || 'after';
        let name = pattern;
        //let priorety = 'queue';
        let optimizers = this.optimizers[name];
        if (optimizers == null) {
            optimizers = { name, fns: [], priorities: [] };
            this.optimizers[name] = optimizers;
        }
        //optimizers.priorities.push(priorety);
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

    private processTags (root, ctx: IContext): Promise<any> {
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
    private processOptimizers(node, ctx: IContext, fns: IOptimizer[]): Promise<any> {
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
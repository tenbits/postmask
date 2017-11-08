import { parse } from '../parser'
import { Report, Result } from '../Result'
import { IOptions } from '../options'
import { mask } from '../global'
import { class_Dfr } from 'atma-utils'

let Optimizers: { [name: string]: IOptimizerCollection } = {};

export interface IContext {
    report: Report
}

export interface IOptimizer {
    (node: any, ctx: IContext, next: INext)
}
export interface INext {
    (node?: any)
}

export async function  optimizeAsync (source: string, path: string, options: IOptions): Promise<Result> {
    let result = parse(source, path);
    let root = result.result;
    let optimizerResult = new Result();
    let beforeFns = getOptimizers('*:before');
    let afterFns = getOptimizers('*:after');
    let ctx = { report: result.report };
    

    root = await processOptimizers(root, ctx, getOptimizers('*:before')) || root;
    root = await processTags(root, ctx) || root;
    root = await processOptimizers(root, ctx, getOptimizers('*:before')) || root; 
    
    let indent = options.minify ? 0 : 4;
    let str = <string>mask.stringify(root, { indent: indent });
    
    let out = new Result();
    out.report = ctx.report;
    out.result = str;
    return out;
}

function processTags (root, ctx: IContext): Promise<any> {
    let dfr = new class_Dfr();
    mask.TreeWalker.walkAsync(
        root
        , function (node, next) {
            var fns = getOptimizers(node.tagName);
            if (fns != null) {
                processOptimizers(root, ctx, fns).then(next);
                return;
            }
            next();
        }
        , function (root) {
            dfr.resolve(root)
        }
    );
    return dfr as any;
}
function processOptimizers(node, ctx: IContext, fns: IOptimizer[]): Promise<any> {
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

/**
 * 
 * @param pattern eg. 'style';`*` ~ `*:before`, `*:after`
 * @param fn 
 */
export function registerOptimizer (pattern: string, fn: IOptimizer) {
    // let rgx = /^([^:]+)(:(.+))?$/;
    // let match = rgx.exec(pattern);
    // let name = match[1];
    // let priorety = match[3] || 'after';
    let name = pattern;
    //let priorety = 'queue';
    let optimizers = Optimizers[name];
    if (optimizers == null) {
        optimizers = { name, fns: [], priorities: [] };
        Optimizers[name] = optimizers;
    }
    //optimizers.priorities.push(priorety);
    optimizers.fns.push(fn);
}
export function getOptimizers (name): IOptimizer[] {
    let optimizers = Optimizers[name];
    if (optimizers == null) {
        return null;
    }
    return optimizers.fns;
}

interface IOptimizerCollection {
    name: string
    fns: IOptimizer[]
    priorities: string[]
}

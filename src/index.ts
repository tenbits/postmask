import { Result } from './Result';
import { IOptions, IGlobalOptions } from './options';
import Single from './single/index'
import { configurate as configuratePlugins } from './plugins'
import { setMask, setIo } from './global'
import Optimizer, { IOptimizer } from './single/Optimizer'

export { 
	Result,
	IOptimizer,	
}

export function	optimizeAsync (source: string, path: string, options?: IOptions): Promise<Result> {
	return Optimizer.optimizeAsync(source, path, options);
}

export function registerOptimizer (pattern: string, fn: IOptimizer) {
	Optimizer.registerOptimizer(pattern, fn);
}
export function removeOptimizer () {
	Optimizer.removeOptimizer();
}
export function configurate (config: IGlobalOptions) {
	if (config.io != null) setIo(config.io);
	if (config.mask != null) setMask(config.mask);

	configuratePlugins(config);
}
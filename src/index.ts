import { Result } from './Result';
import { IOptions, IGlobalOptions } from './options';
import Single from './single/index'
import { configurate as configuratePlugins } from './plugins'
import { setMask, setIo } from './global'
import { IOptimizer, registerOptimizer } from './single/optimizer'

// export = {
// 	optimizeAsync (source: string, path: string, options: IOptions): Promise<Result> {
// 		return Single.optimizeAsync(source, path, options);
// 	},
// 	configurate (config: IGlobalOptions) {
// 		if (config.io != null) setIo(config.io);
// 		if (config.mask != null) setMask(config.mask);

// 		configuratePlugins(config);
// 	},	
// 	registerOptimizer: registerOptimizer
// };
export { Result }

export function	optimizeAsync (source: string, path: string, options: IOptions): Promise<Result> {
		return Single.optimizeAsync(source, path, options);
	}
	export function configurate (config: IGlobalOptions) {
		if (config.io != null) setIo(config.io);
		if (config.mask != null) setMask(config.mask);

		configuratePlugins(config);
	}
	
	export { IOptimizer, registerOptimizer}
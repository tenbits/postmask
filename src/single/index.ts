import { Result } from '../Result';
import { mask } from '../global'
import { class_Uri, class_Dfr } from 'atma-utils'
import { IOptions, prepare as prepareOptions } from '../options';
import { prepare as preparePlugins } from '../plugins'
import { optimizeAsync } from './optimizer'


export default {
	optimizeAsync (source: string, path: string, opts?: IOptions): Promise<Result<string>> {		
		const options = prepareOptions(opts);
		preparePlugins(path, options);
		return optimizeAsync(source, path, options);
	}
};

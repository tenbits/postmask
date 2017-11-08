import { Result } from './Result';
import { mask } from './global'

export function parse(source: string, path: string) {
    let result = new Result<any>();
    mask.off('error')
    mask.on('error', error => result.report.errors.push(error));
    
    mask.off('warn')
    mask.on('warn', warn => result.report.warnings.push(warn));

    result.result = mask.parse(source, path);
    return result;
}

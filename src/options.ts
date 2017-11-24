export interface IOptions {
    minify?: boolean
    base?: string
    plugins?: string[]
    configs?: {
        [key: string]: any
    },
    [key: string]: any
}

export interface IGlobalOptions {
    mask?: any
    io?: any
    [key: string]: any
}

export const Default: IOptions = {
    minify: true,
    base: '/',
    plugins: [],
    configs: {}
}

export function prepare (options: any): IOptions {
    if (options == null) {
        return Default
    }
    for (var key in Default) if (options[key] == null) {
        options[key] = Default[key];
    }
    return options;
}
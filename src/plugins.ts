import { class_Uri } from 'atma-utils'
import { mask } from './global'
import { IOptions } from './options'
import * as pathUtils from 'path'

let lastConfiguration = null;
let lastOptions = null;
let plugins = [];

export function prepare (path: string, options: IOptions) {
    if (lastOptions === options) {
        return;
    }
    lastOptions = options;
    
    var base = options.base;
    if (base[0] === '/') {
        base = class_Uri.combine(process.cwd(), base);
    }

    options.plugins.map(function(name){
        if (name[0] === '.' || name[0] === '/') {
            name = pathUtils.join(process.cwd(), name);
        }
        let factory = require(name);
        if (typeof factory === 'function') {
            plugins.push(factory(mask));
        } else {
            plugins.push(factory);
        }
    });

    for (var key in options.configs) {
        mask.cfg(key, options.configs[key]);
    }

    configurate(lastConfiguration);
}

export function configurate (config: any) {
    lastConfiguration = config;
    plugins
        .filter(plugin => plugin && plugin.configurate)
        .forEach(plugin => plugin.configurate(config));
}
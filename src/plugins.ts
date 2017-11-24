import optimizer, { OptimizerCtor } from './single/Optimizer';
import { class_Uri } from 'atma-utils'
import { mask, io } from './global'
import { IOptions } from './options'
import * as pathUtils from 'path';

let lastConfiguration = null;
let lastOptions = null;
let plugins: IPlugin[] = [];

export interface IPlugin {
    initialize (optimizer: OptimizerCtor, config: any, mask: any, io: any): void
    configurate? (config: any): void     
}

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
            name = pathUtils.join(base, name);
        }
        let plugin: IPlugin = require(name);
        let config = options.configs && options.configs[name];
        if (config) {
            mask.cfg(name, config);            
        }
        plugin.initialize(optimizer, config, mask, io);
        plugins.push(plugin);        
    });

    configurate(lastConfiguration);
}

export function configurate (config: any) {
    lastConfiguration = config;
    plugins
        .filter(plugin => plugin && plugin.configurate)
        .forEach(plugin => plugin.configurate(config));
}
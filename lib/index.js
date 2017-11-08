
				// source ./templates/RootModule.js
				(function(){
					
					
				// source ./templates/ModuleSimplified.js
				var _src_Result;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Report = /** @class */ (function () {
    function Report() {
        this.errors = [];
        this.warnings = [];
    }
    return Report;
}());
exports.Report = Report;
var Message = /** @class */ (function () {
    function Message() {
    }
    return Message;
}());
exports.Message = Message;
var Result = /** @class */ (function () {
    function Result() {
        this.report = new Report();
    }
    return Result;
}());
exports.Result = Result;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_Result) && isObject(module.exports)) {
						Object.assign(_src_Result, module.exports);
						return;
					}
					_src_Result = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_options;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = {
    minify: true,
    base: '/',
    plugins: [],
    configs: {}
};
function prepare(options) {
    if (options == null) {
        return exports.Default;
    }
    for (var key in exports.Default)
        if (options[key] == null) {
            options[key] = exports.Default[key];
        }
    return options;
}
exports.prepare = prepare;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_options) && isObject(module.exports)) {
						Object.assign(_src_options, module.exports);
						return;
					}
					_src_options = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_global;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g = global;
var mask = g.mask || require('maskjs');
exports.mask = mask;
var io = g.io && g.io.File && g.io || require('atma-io');
exports.io = io;
mask.on('error', function (error) {
    console.error(error);
});
mask.on('warn', function (msg) {
    console.warn(msg);
});
function setMask($mask) {
    exports.mask = mask = $mask;
}
exports.setMask = setMask;
function setIo($io) {
    exports.io = io = $io;
}
exports.setIo = setIo;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_global) && isObject(module.exports)) {
						Object.assign(_src_global, module.exports);
						return;
					}
					_src_global = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_plugins;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var atma_utils_1 = require("atma-utils");
var global_1 = _src_global;
var pathUtils = require("path");
var lastConfiguration = null;
var lastOptions = null;
var plugins = [];
function prepare(path, options) {
    if (lastOptions === options) {
        return;
    }
    lastOptions = options;
    var base = options.base;
    if (base[0] === '/') {
        base = atma_utils_1.class_Uri.combine(process.cwd(), base);
    }
    options.plugins.map(function (name) {
        if (name[0] === '.' || name[0] === '/') {
            name = pathUtils.join(process.cwd(), name);
        }
        var factory = require(name);
        if (typeof factory === 'function') {
            plugins.push(factory(global_1.mask));
        }
        else {
            plugins.push(factory);
        }
    });
    for (var key in options.configs) {
        global_1.mask.cfg(key, options.configs[key]);
    }
    configurate(lastConfiguration);
}
exports.prepare = prepare;
function configurate(config) {
    lastConfiguration = config;
    plugins
        .filter(function (plugin) { return plugin && plugin.configurate; })
        .forEach(function (plugin) { return plugin.configurate(config); });
}
exports.configurate = configurate;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_plugins) && isObject(module.exports)) {
						Object.assign(_src_plugins, module.exports);
						return;
					}
					_src_plugins = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_parser;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = _src_Result;
var global_1 = _src_global;
function parse(source, path) {
    var result = new Result_1.Result();
    global_1.mask.off('error');
    global_1.mask.on('error', function (error) { return result.report.errors.push(error); });
    global_1.mask.off('warn');
    global_1.mask.on('warn', function (warn) { return result.report.warnings.push(warn); });
    result.result = global_1.mask.parse(source, path);
    return result;
}
exports.parse = parse;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_parser) && isObject(module.exports)) {
						Object.assign(_src_parser, module.exports);
						return;
					}
					_src_parser = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_single_optimizer;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = _src_parser;
var Result_1 = _src_Result;
var global_1 = _src_global;
var atma_utils_1 = require("atma-utils");
var Optimizers = {};
function optimizeAsync(source, path, options) {
    return __awaiter(this, void 0, void 0, function () {
        var result, root, optimizerResult, beforeFns, afterFns, ctx, indent, str, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = parser_1.parse(source, path);
                    root = result.result;
                    optimizerResult = new Result_1.Result();
                    beforeFns = getOptimizers('*:before');
                    afterFns = getOptimizers('*:after');
                    ctx = { report: result.report };
                    return [4 /*yield*/, processOptimizers(root, ctx, getOptimizers('*:before'))];
                case 1:
                    root = (_a.sent()) || root;
                    return [4 /*yield*/, processTags(root, ctx)];
                case 2:
                    root = (_a.sent()) || root;
                    return [4 /*yield*/, processOptimizers(root, ctx, getOptimizers('*:before'))];
                case 3:
                    root = (_a.sent()) || root;
                    indent = options.minify ? 0 : 4;
                    str = global_1.mask.stringify(root, { indent: indent });
                    out = new Result_1.Result();
                    out.report = ctx.report;
                    out.result = str;
                    return [2 /*return*/, out];
            }
        });
    });
}
exports.optimizeAsync = optimizeAsync;
function processTags(root, ctx) {
    var dfr = new atma_utils_1.class_Dfr();
    global_1.mask.TreeWalker.walkAsync(root, function (node, next) {
        var fns = getOptimizers(node.tagName);
        if (fns != null) {
            processOptimizers(root, ctx, fns).then(next);
            return;
        }
        next();
    }, function (root) {
        dfr.resolve(root);
    });
    return dfr;
}
function processOptimizers(node, ctx, fns) {
    var dfr = new atma_utils_1.class_Dfr();
    if (fns == null || fns.length === 0) {
        dfr.resolve();
        return dfr;
    }
    var i = -1;
    var result = null;
    function process() {
        if (++i >= fns.length) {
            dfr.resolve(result);
            return;
        }
        var fn = fns[i];
        fn(node, ctx, function ($result) {
            result = $result;
            process();
        });
    }
    process();
    return dfr;
}
/**
 *
 * @param pattern eg. 'style';`*` ~ `*:before`, `*:after`
 * @param fn
 */
function registerOptimizer(pattern, fn) {
    // let rgx = /^([^:]+)(:(.+))?$/;
    // let match = rgx.exec(pattern);
    // let name = match[1];
    // let priorety = match[3] || 'after';
    var name = pattern;
    //let priorety = 'queue';
    var optimizers = Optimizers[name];
    if (optimizers == null) {
        optimizers = { name: name, fns: [], priorities: [] };
        Optimizers[name] = optimizers;
    }
    //optimizers.priorities.push(priorety);
    optimizers.fns.push(fn);
}
exports.registerOptimizer = registerOptimizer;
function getOptimizers(name) {
    var optimizers = Optimizers[name];
    if (optimizers == null) {
        return null;
    }
    return optimizers.fns;
}
exports.getOptimizers = getOptimizers;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_single_optimizer) && isObject(module.exports)) {
						Object.assign(_src_single_optimizer, module.exports);
						return;
					}
					_src_single_optimizer = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_single_index;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = _src_options;
var plugins_1 = _src_plugins;
var optimizer_1 = _src_single_optimizer;
exports.default = {
    optimizeAsync: function (source, path, opts) {
        var options = options_1.prepare(opts);
        plugins_1.prepare(path, options);
        return optimizer_1.optimizeAsync(source, path, options);
    }
};
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_single_index) && isObject(module.exports)) {
						Object.assign(_src_single_index, module.exports);
						return;
					}
					_src_single_index = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = _src_Result;
exports.Result = Result_1.Result;
var index_1 = _src_single_index;
var plugins_1 = _src_plugins;
var global_1 = _src_global;
var optimizer_1 = _src_single_optimizer;
exports.IOptimizer = optimizer_1.IOptimizer;
exports.registerOptimizer = optimizer_1.registerOptimizer;
function optimizeAsync(source, path, options) {
    return index_1.default.optimizeAsync(source, path, options);
}
exports.optimizeAsync = optimizeAsync;
function configurate(config) {
    if (config.io != null)
        global_1.setIo(config.io);
    if (config.mask != null)
        global_1.setMask(config.mask);
    plugins_1.configurate(config);
}
exports.configurate = configurate;

				
				}());
				// end:source ./templates/RootModule.js
				
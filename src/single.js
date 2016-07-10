var Uri = require('atma-utils').class_Uri,
	mask;

module.exports = {
	process: function(source, path, options){
		var opts = prepair(path, options);

		return new Promise((resolve, reject) => {
			Optimizer.optimizeAsync(source, options, function(error, data){
				if (error == null) {
					resolve(data);
					return;
				}
				reject({
					content: error.toString(),
					error: error
				});
			});
		});			
	}
};

var Optimizer = {
	optimizeAsync: function (source, options, fn) {
		var ast = typeof source === 'string' ? mask.parse(source) : source;
		mask.optimize(ast, function(ast){
			var indent = options.minify ? 0 : 4;
			var str = mask.stringify(ast, { indent: indent });
			fn(null, str);
		});
	}
}

function prepair (path, options) {
	if (mask == null) {
		mask = require('maskjs');
		mask.on('error', function(error) {
			console.error(error);
		});
		mask.on('warn', function(msg) {
			console.warn(msg);
		});
	}
	
	var uri = new Uri(path)
	var base = options && options.base || '/';
	if (base[0] === '/') {
		base = Uri.combine(process.cwd(), base);
	}

	options.plugins.map(function(name){
		if (name[0] === '.' || name[0] === '/') {
			name = require('path').join(process.cwd(), name);
		}
		require(name);
	});

	return {
		settings: {
			from: uri.toLocalFile(),
			minify: options.minify
		}
	};
}
var Single = require('./single.js');
			
module.exports = {
	processSource: function(source, path, options){
		return Single.process(source, path, options);
	}
};
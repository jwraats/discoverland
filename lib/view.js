/*
 * /lib/view.js
 */
var fs = require('fs');
var Mustache = require('mustache');
var view = function() {};

view.prototype = {
	renderView : function(options, data, callback) {

		var self = this;
		
		options.name = options.name || 'default';
		options.format = options.format || 'html';
		options.layout = options.layout || {};
		
		if (typeof callback !== 'function') throw ViewCallbackException;
		
		self.getView(options.name, options.format, function(content) {
			var template = Mustache.to_html(content, data);

			self.getLayout(options.layout, function(content) {
				content = self.setLayoutContent(content, template);
				callback(content);
			});
		});
	},
  
	getView : function(name, format, callback) {
		var self = this;

		if (!name) {
			return '';
		}

		var format = format ? format : 'html';
		var path = './app/views/actions/' + name + '.' + format;

		// callback handling
		var callback = (typeof callback === 'function') ? callback : function() {
		};

		fs.readFile(path, 'utf-8', function(error, content) {
			if (error) {
				throw ViewNotFoundException;
			}
			else {
				callback(content);
			}
		});
	},
	
	getLayout : function(options, callback) {
		var self = this;
		var options = options ? options : {
			'name' : 'default',
			'format' : 'html'
		};
		
		var name   = options.name ? options.name : 'default';
		var format = options.format ? options.format : 'html';

		// callback handling
		var callback = (typeof callback === 'function') ? callback : function() {
		};

		var path = './app/views/layouts/' + name + '.' + format;

		fs.readFile(path, 'utf-8', function(error, content) {
			if (error) {
				throw LayoutNotFoundException;
			}
			else {
				callback(content);
			}
		});
	},

	setLayoutContent : function(layout, content) {
		var self = this;
		var layout = layout ? layout : '';
		var context = {
			'content_for_layout' : content ? content : ''
		};
		return Mustache.to_html(layout, context);
	},
};

module.exports = new view();
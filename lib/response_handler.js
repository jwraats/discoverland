/*
 * /lib/response_handler.js
 */
var fs = require('fs');
// Constructor
var response_handler = function(res) {
	this.res = res;
	this.contentType = 'text/plain';
};

// properties and methods
response_handler.prototype = {
	//store the node response object so we can operate on it
	res: {},
	serverError : function(code, content) {
		var self = this;
		self.res.writeHead(code, {'Content-Type': 'text/plain'});
		self.res.end(content);
	},
	render : function(content) {
		var self = this;
		self.res.writeHead(200, {'Content-Type': self.contentType});
		self.res.end(content, 'utf-8');
	},	
	/*renderHtml : function(content) {
		var self = this;
		self.res.writeHead(200, {'Content-Type': 'text/html'});
		self.res.end(content, 'utf-8');
	},
	renderJson : function(content) {
		var self = this;
		self.res.writeHead(200, {'Content-Type': 'application/json'});
		self.res.end(content, 'utf-8');
	},*/
	setHtml : function() {
		this.contentType = 'text/html';
	},
	setJson : function() {
		this.contentType = 'application/json';
	},
	setContentType : function(contentType) {
		this.contentType = contentType;
	},
	renderWebroot : function(requestedUrl) {
		var self = this;
		//try and match a file in our webroot directory
		fs.readFile('./app/webroot' + requestedUrl.href, function(error, content) {
			if (error) {
				self.pageNotFound();
			} else {
				var extension = (requestedUrl.pathname.split('.').pop());
				self.res.writeHead(200, self.getHeadersByFileExtension(extension));
				self.res.end(content, 'utf-8');
			}
		});
	},
	pageNotFound : function() {
		this.serverError(404, '404 Bad Request');
	},
	getHeadersByFileExtension : function(extension) {
		var self = this;
		var headers = {};

		switch (extension) {
			case 'html':
				headers['Content-Type'] = 'text/html';
				break;
			case 'css':
				headers['Content-Type'] = 'text/css';
				break;
			case 'js':
				headers['Content-Type'] = 'application/javascript';
				break;
			case 'ico':
				headers['Content-Type'] = 'image/x-icon';
				break;
			default:
				headers['Content-Type'] = 'text/plain';
		}
		return headers;
	}
};

// node.js module export
module.exports = response_handler;
/*
 * /lib/response_handler.js
 */
var fs = require('fs');
// Constructor
var request_handler = function(req) {
	this.req = req;
};

// properties and methods
request_handler.prototype = {
	//store the node response object so we can operate on it
	req: {},
	post: function(name) {
		return this.req.postData[name];
	},
	isPut : function() {
		return this.req.method == "PUT";
	},
	isDelete : function() {
		return this.req.method == "DELETE";
	},
	isGet : function() {
		return this.req.method == "GET";
	},
	isPost : function() {
		return this.req.method == "POST";
	},
};

// node.js module export
module.exports = request_handler;
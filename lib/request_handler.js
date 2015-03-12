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
	}
};

// node.js module export
module.exports = request_handler;
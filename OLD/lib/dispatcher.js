/*
 * /lib/dispatcher.js
 */
var fs                      = require('fs');
var url                     = require('url');
var request_handler = require('./request_handler');
var response_handler = require('./response_handler');

this.dispatch = function(req, res) {

	//set up response object
	requestHandler = new request_handler(req);
	responseHandler = new response_handler(res);

	var requestedUrl = url.parse(req.url);
    var parts, action, argument;

	if (requestedUrl.pathname == '/') {
		//action = 'home';
		parts = new Array('');
	}
	else {
		parts = req.url.split('/');
	}
	
	this.getController(parts, function(controller) {
		if(controller != null)
			try {
				controller.render(parts, requestHandler, responseHandler);
			}
			catch (error) {
				console.log(error);
				responseHandler.renderError(500, 'Internal Server Error');
			}
		else {console.log('static?');
			responseHandler.renderWebroot(requestedUrl);
		}
	});
};

this.getController = function(parts, callback) {
	this.getControllerByDir('./app/controller', parts, 1, function(controller) {
		callback(controller);
	});
}

this.getControllerByDir = function(dir, parts, dirsOver, callback) {
	var dispatcher = this;
	globalStop = false;
	dirsOver--;
	fs.readdir(dir, function (err, list) {
		var found = list.length;
		list.forEach(function (file) {
			// Full path of that file
			var path = dir + "/" + file;
			// Get the file's stats
			fs.stat(path, function (err, stat) {
				// If the file is a directory
				if (stat && stat.isDirectory()) {
					dirsOver++;
					found--;
					// Dive into the directory
					dispatcher.getControllerByDir(path, parts, dirsOver, callback);
				}
				else {
					// Call the action
					var controller = require('.' + path);
					if(controller.resolve(parts)) {
						callback(controller);
						found = -1;
						globalStop = true;
					}
					else {
						found--;
					}
				}
				console.log(dir + " = " + dirsOver + " = " + found + " = " + globalStop);
				if(dirsOver == 0 && found == 0 && globalStop == false) {
					callback(null);
				}
			});
		});
	});
}
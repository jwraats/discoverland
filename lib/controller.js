/*
 * /lib/controller.js
 */
var view = require('./view');
var controller = function() {};

controller.prototype = {
	view : function(user, responseHandler) {
		var data = {
			'user' : user ? user : 'nobody'
		};
		
		var options = {
			name : 'view',
			/*format : 'html',
			layout : {
				name : 'default',
				format : 'html'
			}*/
		}

		view.renderView(options, data, function(data) {
			responseHandler.setHtml();
			responseHandler.render(data);
		});
	},

	home : function(arg, responseHandler) {
		var data = {
			'users' : {
				'name'    : 'James',
				'viewLink': '/view/james/'
			}
		};

		var options = {
			name : 'home',
			format : 'html',
			layout : {
				name : 'default',
				format : 'html'
			}
		}
		
		view.renderView(options, data, function(data) {
			responseHandler.setHtml();
			responseHandler.render(data);
		});
	},
	
	json : function(arg, responseHandler) {
		var data = {
			'users' : {
				'name'    : 'James',
				'viewLink': '/view/james/'
			}
		};
		
		var options = {
			name : 'jHome',
			format : 'json',
			layout : {
				name : 'default',
				format : 'json'
			}
		}

		view.renderView(options, data, function(data) {
			responseHandler.setJson();
			responseHandler.render(data);
		});
	},
};

module.exports = new controller();
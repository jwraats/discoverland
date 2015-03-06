/*
 * /app/controller/createUser.js
 */
 var view = require('../../../lib/view');
var createUser = function() {};

createUser.prototype = {
	resolve : function(parts) {
		if(parts.length >= 4) {
			if(parts[1] == 'api' && parts[2] == 'user' && parts[3] == 'create') {
				return true;
			}
		}
		return false;
	},
	render : function(parts, responseHandler) {
		var data = {
			'users' : {
				'name'    : 'James',
				'viewLink': '/view/james/'
			}
		};
		
		var options = {
			name : 'userCreate',
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
	}
};

module.exports = new createUser();
/*
 * /app/controller/deleteUser.js
 */
 var view = require('../../../lib/view');
var deleteUser = function() {};

deleteUser.prototype = {
	resolve : function(parts) {
		if(parts.length >= 4) {
			if(parts[1] == 'api' && parts[2] == 'user' && parts[3] == 'delete') {
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
			name : 'userDelete',
			format : 'json',
			layout : {
				name : 'default',
				format : 'json'
			}
		}

		view.renderView(options, data, function(data) {
			responseHandler.setJson();
			console.log(data);
			responseHandler.render(data);
		});
	}
};

module.exports = new deleteUser();
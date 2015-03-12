/*
 * /app/controller/createUser.js
 */
 var view = require('../../../lib/view');
var createUser = function() {};

createUser.prototype = {
	resolve : function(parts) {
		if(parts.length >= 4) {
			if(parts[1] == 'api') {
				return true;
			}
		}
		return false;
	},
	render : function(parts, responseHandler) {
	
	responseHandler.post('a');
	
		var data = {
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
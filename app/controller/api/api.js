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
	render : function(parts, req, responseHandler) {
	
		switch(parts[2]) {
			case 'map':
				this.map(parts, req, responseHandler);
				break;
			default:
				responseHandler.pageNotFound();
				break;
		}
	},
	map : function(parts, req, responseHandler) {
		
	console.log('PO: ' + req.post('po'));
			console.log('TEST: ' + req.post('test'));
			
			
	
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
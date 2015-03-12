/*
 * /app/controller/index.js
 */
 var view = require('../../lib/view');
var index = function() {};

index.prototype = {
	resolve : function(parts) {
		if(parts.length == 1) {
				return true;
		}
		return false;
	},
	render : function(parts, req, responseHandler) {
		var data = {
			'users' : {
				'name'    : 'James',
				'viewLink': '/view/james/'
			}
		};
		
		var options = {
			name : 'index'
		}

		view.renderView(options, data, function(data) {
			responseHandler.setHtml();
			responseHandler.render(data);
		});
	}
};

module.exports = new index();
/*
 * /app/controller/createUser.js
 */
 var view = require('../../../lib/view');
 var mysql		= require('mysql');
var createUser = function() {};

createUser.prototype = {
	resolve : function(parts) {
		if(parts.length >= 3) {
			if(parts[1] == 'api') {
				return true;
			}
		}
		return false;
	},
	render : function(parts, req, responseHandler) {
	
		switch(parts[2]) {
			case 'tileset':
				this.tileset(parts, req, responseHandler);
				break;
			default:
				responseHandler.pageNotFound();
				break;
		}
	},
	tileset : function(parts, req, responseHandler) {
		var model = require('../../model/tileset');
		var connection = mysql.createConnection(
		{
			host : 'localhost',
			user : 'discoverland',
			password : 'd1sc0v3rl4nd',
			database : 'discoverland'
		});
		
		console.log(model.load);
		if(req.isPut()) {
			console.log('it was put');
		}
		else if(req.isPost()) {
			console.log('it was post');
		}
		else if(req.isGet()) {
			var data = {
				'success': false
			};
			
			var options = {
				name : 'tileset',
				format : 'json',
				layout : {
					name : 'default',
					format : 'json'
				}
			}
			
			//Retrieve tilesets
			if(parts.length == 4) {
			console.log('before model load');
				model.load(connection, parts[3], function(success) {
				console.log('model callback');
					if(success) {
						data = {
							'success': true,
							'single':true,
							'data' : tileset.json()
						}
					}
					
					view.renderView(options, data, function(data) {
						responseHandler.setJson();
						responseHandler.render(data);
					});
				});
			}
			else {
				model.loadAll(connection, function(success,tilesets) {
					if(success) {
						var returnData = new Array();
						for(i = 0; i < tilesets; i++) {
							returnData[i] = tilesets[i].json();
						}
						
						data = {
							'success': true,
							'single':false,
							'data' : returnData
						}
					}
					
					view.renderView(options, data, function(data) {
						responseHandler.setJson();
						responseHandler.render(data);
					});
				});
			}
			return;
		}
		else if(req.isDelete()) {
			console.log('it was delete');
		}
		else {
			responseHandler.pageNotFound();
			return;
		}
	//console.log('PO: ' + req.post('po'));
	//		console.log('TEST: ' + req.post('test'));
			
		view.renderView(options, data, function(data) {
			responseHandler.setJson();
			responseHandler.render(data);
		});
	}
};

module.exports = new createUser();
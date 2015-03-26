var info = {
	tileset:  function(req, res) {
		var model = require('../model/tileset.js');
		var data = {
			'success': false
		};
		
		var connection = req.app.get('dbConnection');
			
		model.loadAll(connection, function(success,tilesets) {
			if(success) {
				var returnData = {};
				for(i = 0; i < tilesets.length; i++) {
					returnData[i] = tilesets[i].json();
				}
				
				data = {
					'success': true,
					'single':false,
					'data': returnData,
				}
			}
			
			res.json(data);
		});		
	},
	tilesetId:  function(req, res) {
		var model = require('../model/tileset.js');
		var data = {
			'success': false
		};
		
		var id = parseInt(req.params.id);
		
		var connection = req.app.get('dbConnection');
		model.load(connection, id, function(success) {
			if(success) {
				data = {
					'success': true,
					'single':true,
					'data': model.json(),
				}
			}
			
			res.json(data);
		});
	},
	insertTileset: function(req, res) {
	
	},
	updateTileset: function(req, res) {
	
	},
	deleteTileset: function(req, res) {
		var model = require('../model/tileset.js');
		var id = parseInt(req.params.id);
		
		var connection = req.app.get('dbConnection');
		model.load(connection, id, function(success) {
			if(success) {
				model.delete(connection, function(callback) {
					if(callback) {
						res.status(204);
					}
					else {
						res.status(404);
					}
				});
			}
			else {
				res.status(404);
			}
			res.type('txt').send('');
		});
	},
	
	map:  function(req, res) {
		var model = require('../model/map.js');
		var data = {
			'success': false
		};
		
		var connection = req.app.get('dbConnection');
			
		model.loadAll(connection, function(success,tilesets) {
			if(success) {
				var returnData = {};
				for(i = 0; i < tilesets.length; i++) {
					returnData[i] = tilesets[i].json();
				}
				
				data = {
					'success': true,
					'single':false,
					'data': returnData,
				}
			}
			
			res.json(data);
		});		
	},
	mapId:  function(req, res) {
		var model = require('../model/map.js');
		var data = {
			'success': false
		};
		
		var id = parseInt(req.params.id);
		
		var connection = req.app.get('dbConnection');
		model.load(connection, id, function(success) {
			if(success) {
				model.jsonWithTileset(connection, function(success, result) {
					if(success) {
						data = {
							'success': true,
							'single':true,
							'data': result,
						}
						res.json(data);
					}
					else {
						res.json(data);
					}
				});
			}
			else {
				res.json(data);
			}
		});
	},
	insertMap: function(req, res) {
	
	},
	updateMap: function(req, res) {
	
	},
	deleteMap: function(req, res) {
		var model = require('../model/map.js');
		var id = parseInt(req.params.id);
		
		var connection = req.app.get('dbConnection');
		model.load(connection, id, function(success) {
			if(success) {
				model.delete(connection, function(callback) {
					if(callback) {
						res.status(204);
					}
					else {
						res.status(404);
					}
				});
			}
			else {
				res.status(404);
			}
			res.type('txt').send('');
		});
	}
};

module.exports = info;
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
		var connection = req.app.get('dbConnection');
		
		var model = require('../model/tileset.js');
		model.clear();
		
		if(req.body.name == undefined || req.body.tileSize == undefined || parseInt(req.body.tileSize) == NaN) {
			res.status(422);
			res.json({ error: { code: 1, message: "Missing fields" }});
			return;
		}
		
		model.setName(req.body.name);
		model.setTileSize(parseInt(req.body.tileSize));
		model.save(connection, function(success) {
			if(success) {
				res.json( { 'success': true, 'single': true, 'data': model.json() });
			}
			else {
				res.json({'success':  false });
			}
		});
	},
	updateTileset: function(req, res) {
		var model = require('../model/tileset.js');
		var id = parseInt(req.params.id);
		
		var connection = req.app.get('dbConnection');
		model.load(connection, id, function(success) {
			if(success) {
				if(req.body.name == undefined || req.body.tileSize == undefined || parseInt(req.body.tileSize) == NaN) {
					res.status(422);
					res.json({ error: { code: 1, message: "Missing fields" }});
					return;
				}
				model.setName(req.body.name);
				model.setTileSize(parseInt(req.body.tileSize));
				model.save(connection, function(success) {
					if(success) {
						res.json( { 'success': true, 'single': true, 'data': model.json() });
					}
					else {
						res.json({'success':  false });
					}
				});
			}
			else {
				res.status(404);
				res.type('txt').send('');
			}
		});
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
		var connection = req.app.get('dbConnection');
		
		var model = require('../model/map.js');
		model.clear();
		
		if(req.body.name == undefined) {
			res.status(422);
			res.json({ error: { code: 1, message: "Missing fields" }});
			return;
		}
		
		model.setName(req.body.name);
		model.save(connection, function(success) {
			if(success) {
				res.json( { 'success': true, 'single': true, 'data': model.json() });
			}
			else {
				res.json({'success':  false });
			}
		});
	},
	updateMap: function(req, res) {
		var model = require('../model/map.js');
		var id = parseInt(req.params.id);
		
		var connection = req.app.get('dbConnection');
		model.load(connection, id, function(success) {			
			if(success) {
				if(req.body.name == undefined) {
					res.status(422);
					res.json({ error: { code: 1, message: "Missing fields" }});
					return;
				}
				model.setName(req.body.name);
				model.save(connection, function(success) {
					if(success) {
						res.json( { 'success': true, 'single': true, 'data': model.json() });
					}
					else {
						res.json({'success':  false });
					}
				});
			}
			else {
				res.status(404);
				res.type('txt').send('');
			}
		});
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
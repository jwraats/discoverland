var express = require('express');
var fs = require('fs');
var db = require('../dbsql'); //Bron: http://stackoverflow.com/questions/25125615/nodejs-express-make-available-mysql-connection-object-in-router-file
var router = express.Router();

router.get('/tileset', function(req, res) {
	var model = require('../model/tileset.js');
	var data = {
		'success': false
	};
		
	model.loadAll(db, function(success,tilesets) {
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
		
		res.clearTmp();
		res.json(data);
	});		
});

router.get('/tileset/:id', function(req, res) {
	var model = require('../model/tileset.js');		
	var id = parseInt(req.params.id);
	
	model.load(db, id, function(success) {
		if(success) {
			data = {
				'success': true,
				'single':true,
				'data': model.json(),
			}
			res.clearTmp();
			res.json(data);
		}
		else {
			res.status(404);
			res.clearTmp();
			res.type('txt').send('');
		}
	});
});

router.post('/tileset', function(req, res) {
	
	var model = require('../model/tileset.js');
	model.clear();
	
	if(req.body.name == undefined || req.body.tileSize == undefined || parseInt(req.body.tileSize) == NaN  || req.files == undefined || req.files.tileset == undefined || req.files.tileset.extension.toLowerCase() != 'png') {
		res.status(422);
		res.clearTmp();
		res.json({ error: { code: 1, message: "Missing fields" }});
		return;
	}
	
	model.setName(req.body.name);
	model.setTileSize(parseInt(req.body.tileSize));
	model.save(db, function(success) {		
		if(success) {
			var rootDir = req.app.get('rootDir');
			fs.rename(rootDir + '/' + req.files.tileset.path, rootDir + '/public/tilesetImg/' + model.getId() + '.png', function(err) {
				if(!err) {
					res.clearTmp();
					res.json( { 'success': true, 'single': true, 'data': model.json() });
				}
				else {
					res.clearTmp();
					res.json({'success':  false, 'err': err });
				}
			});
		}
		else {
			res.clearTmp();
			res.json({'success':  false, 'err': 'unknown' });
		}
	});
});

router.put('/tileset/:id', function(req, res) {
	var model = require('../model/tileset.js');
	var id = parseInt(req.params.id);
	
	model.load(db, id, function(success) {
		if(success) {
			if(req.body.name == undefined || req.body.tileSize == undefined || parseInt(req.body.tileSize) == NaN  || (req.files != undefined && req.files.tileset != undefined && req.files.tileset.extension.toLowerCase() != 'png')) {
				res.status(422);
				res.clearTmp();
				res.json({ error: { code: 1, message: "Missing fields" }});
				return;
			}
			model.setName(req.body.name);
			model.setTileSize(parseInt(req.body.tileSize));
			model.save(db, function(success) {
				if(success) {
					var rootDir = req.app.get('rootDir');
					if(req.files != undefined && req.files.tileset != undefined) {
						fs.rename(rootDir + '/' + req.files.tileset.path, rootDir + '/public/tilesetImg/' + model.getId() + '.png', function(err) {
							if(!err) {
								res.clearTmp();
								res.json( { 'success': true, 'single': true, 'data': model.json() });
							}
							else {
								res.clearTmp();
								res.json({'success':  false, 'err': err });
							}
						});
					}
					else {
						res.clearTmp();
						res.json( { 'success': true, 'single': true, 'data': model.json() });
					}
				}
				else {
					res.clearTmp();
					res.json({'success':  false, 'err': 'unknown' });
				}
			});
		}
		else {
			res.status(404);
			res.clearTmp();
			res.type('txt').send('');
		}
	});
});

router.delete('/tileset/:id', function(req, res) {
	var model = require('../model/tileset.js');
	var id = parseInt(req.params.id);
	
	model.load(db, id, function(success) {
		if(success) {
			model.delete(db, function(callback) {
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
});


router.get('/map', function(req, res) {
	var model = require('../model/map.js');
	var data = {
		'success': false
	};
	
		
	model.loadAll(db, function(success,tilesets) {
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
		
		res.clearTmp();
		res.json(data);
	});		
});

router.get('/map/:id', function(req, res) {
	var model = require('../model/map.js');
	var data = {
		'success': false
	};
	
	var id = parseInt(req.params.id);
	
	model.load(db, id, function(success) {
		if(success) {
			model.jsonWithTileset(db, function(success, result) {
				if(success) {
					data = {
						'success': true,
						'single':true,
						'data': result,
					}
					res.clearTmp();
					res.json(data);
				}
				else {
					res.clearTmp();
					res.json(data);
				}
			});
		}
		else {
			res.clearTmp();
			res.status(404);
			res.type('txt').send('');
		}
	});
});

router.post('/map', function(req, res) {
	
	var model = require('../model/map.js');
	model.clear();
	
	if(req.body.name == undefined || req.body.tiles == undefined) {
		res.status(422);
		res.clearTmp();
		res.json({ error: { code: 1, message: "Missing fields" }});
		return;
	}
	
	model.setName(req.body.name);
	model.setTiles(req.body.tiles);
	model.save(db, function(success) {
		if(success) {
			res.clearTmp();
			res.json( { 'success': true, 'single': true, 'data': model.json() });
		}
		else {
			res.clearTmp();
			res.json({'success':  false });
		}
	});
});

router.put('/map/:id', function(req, res) {
	var model = require('../model/map.js');
	var id = parseInt(req.params.id);
	
	model.load(db, id, function(success) {			
		if(success) {
			if(req.body.name == undefined || req.body.tiles == undefined) {
				res.status(422);
				res.clearTmp();
				res.json({ error: { code: 1, message: "Missing fields" }});
				return;
			}
			model.setName(req.body.name);
			model.setTiles(req.body.tiles);
			model.save(db, function(success) {
				if(success) {
					res.clearTmp();
					res.json( { 'success': true, 'single': true, 'data': model.json() });
				}
				else {
					res.clearTmp();
					res.json({'success':  false });
				}
			});
		}
		else {
			res.status(404);
			res.type('txt').send('');
		}
	});
});
	
router.delete('/map/:id', function(req, res) {
	var model = require('../model/map.js');
	var id = parseInt(req.params.id);
	
	model.load(db, id, function(success) {
		if(success) {
			model.delete(db, function(callback) {
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
});

module.exports = router;
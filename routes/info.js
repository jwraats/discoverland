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
};

module.exports = info;
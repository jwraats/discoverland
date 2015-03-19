var info = {
	tileset:  function(req, res) {
		var model = require('../model/tileset.js');
		var data = {
			'success': false
		};
		
		var connection = req.app.get('dbConnection');
			
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
			
			res.json(data);
		});		
	},
};

module.exports = info;
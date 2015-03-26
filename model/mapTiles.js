var mapTiles = function() {
};

// properties and methods
mapTiles.prototype = {
	//store the node response object so we can operate on it
	//id, name, path, tilesize
	load:function(connection, id, callback) {
	var mapTiles = this;
		connection.query("SELECT * FROM mapTiles WHERE map_id = ?",[id], function(err, rows){
			if(err != null || rows == undefined) {
				callback(false, null);
				return false;
			}
			
			var returnData = {};
			
			for(i = 0; i < rows.length; i++) {
			
				results[i] = { 'x': rows[i].x, 'y': rows[i].y, 'layer': rows[i].layer, 'tileset': rows[i].tileset_id }; 
			}
			
			callback(true, returnData);
		});
	}
	
};

// node.js module export
module.exports = new mapTiles();
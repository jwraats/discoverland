// Constructor
var map = function() {
};

// properties and methods
map.prototype = {
	//store the node response object so we can operate on it
	//id, name, path, tilesize
	getId : function() {
		return this.id;
	},
	getName : function() {
		return this.name;
	},
	setName : function(name) {
		this.name = name;
	},
	setTiles: function(tiles) {
		this.tiles = tiles;
	},
	delete : function(connection, callback) {
		if(this.id == 0) {
			callback(false);
			return;
		}
			
		connection.query("DELETE map, mapTiles FROM map LEFT JOIN mapTiles ON (map.id = mapTiles.map_id) WHERE map.id = ?",[this.id], function(err, res){
			callback(err == null);
		});
	},
	save : function(connection, callback) {
		var map = this;
		if(this.id == 0 || this.id == undefined) {
			connection.query("INSERT INTO map(name) VALUE(?)",[this.name], function(err, res){
				if(err != null) {
					callback(false);
					return;
				}
				
				map.id = res.insertId;
				
				if(Array.isArray(map.tiles)) {
					for(i = 0; i < map.tiles.length; i++) {
						if(map.tiles[i].x == undefined ||
							map.tiles[i].y == undefined ||
							map.tiles[i].layer == undefined ||
							map.tiles[i].tileset_id == undefined ||
							map.tiles[i].tileset_nr == undefined) {
							continue;
						}
						
						connection.query("INSERT INTO mapTiles(map_id, x, y, layer, tileset_id, tileset_nr) VALUE(?,?,?,?,(SELECT id FROM tileset WHERE id = ?),?)",[map.id, map.tiles[i].x, map.tiles[i].y, map.tiles[i].layer, map.tiles[i].tileset_id, tileset_nr], function(err, res){
							//If query fail ignore it.
						});
					}
				}
				callback(true);
			});
		}
		else {
			connection.query("UPDATE map SET name = ? WHERE id = ?",[this.name, this.id], function(err, res){
				if(err != null) {
					callback(false);
					return;
				}
				
				//Delete all old tiles
				connection.query("DELETE mapTiles WHERE map_id = ?",[map.id], function(err, res) {
					if(err != null) {
						callback(false);
						return;
					}
					
					if(Array.isArray(map.tiles)) {
						for(i = 0; i < map.tiles.length; i++) {
							if(map.tiles[i].x == undefined ||
								map.tiles[i].y == undefined ||
								map.tiles[i].layer == undefined ||
								map.tiles[i].tileset_id == undefined ||
								map.tiles[i].tileset_nr == undefined) {
								continue;
							}
							connection.query("INSERT INTO mapTiles(map_id, x, y, layer, tileset_id, tileset_nr) VALUE(?,?,?,?,(SELECT id FROM tileset WHERE id = ?),?)",[map.id, map.tiles[i].x, map.tiles[i].y, map.tiles[i].layer, map.tiles[i].tileset_id, tileset_nr], function(err, res){
								//If query fail ignore it.
							});
						}
					}
					callback(true);
				});
			});
		}
	},
	loadAll : function(connection, callback) {
		connection.query("SELECT * FROM map",[], function(err, rows){
			if(err != null || rows == undefined) {
				callback(false, null);
				return;
			}
			
			var results = new Array();
			
			for(i = 0; i < rows.length; i++) {
				var object = new map();
				object.loadData(rows[i]);
				results[i] = object;
			};
			callback(true, results);
			
		});
	},
	load:function(connection, id, callback) {
	var map = this;
		connection.query("SELECT * FROM map WHERE id = ?",[id], function(err, rows){
			if(err != null || rows == undefined || rows.length != 1) {
				callback(false);
				return false;
			}
			
			map.loadData(rows[0]);
			callback(true);
		});
	},
	loadData:function(data) {
		this.id = data.id;
		this.name = data.name;
	},
	json:function() {
		return { 'id': this.id, 'name': this.name };
	},
	jsonWithTileset:function(connection, callback) {
		var map = this;
		connection.query("SELECT * FROM mapTiles WHERE map_id = ?",[map.id], function(err, rows){
			if(err != null || rows == undefined) {
				callback(false, null);
				return false;
			}
			
			var tileData = {};
			
			for(i = 0; i < rows.length; i++) {
			
				tileData[i] = { 'x': rows[i].x, 'y': rows[i].y, 'layer': rows[i].layer, 'tileset': rows[i].tileset_id, 'tileset_nr': rows[i].tileset_nr }; 
			}
			
			callback(true, { 'id': map.id, 'name': map.name, 'tiles': tileData });
		});
	},
	clear:function() {
		this.id = undefined;
		this.name = undefined;
	}
	
	
};

// node.js module export
module.exports = new map(); 
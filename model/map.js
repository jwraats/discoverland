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
	delete : function(connection, callback) {
		if(this.id == 0) {
			callback(false);
			return;
		}
			
		connection.query("DELETE FROM map WHERE id = ?",[this.id], function(err, res){
			callback(err == null);
		});
	},
	save : function(connection, callback) {
		var map = this;
		if(this.id == 0 || this.id == undefined) {
			connection.query("INSERT INTO map(name) VALUE(?)",[this.name], function(err, res){
				map.id = res.insertId;
				callback(err == null);
			});
		}
		else {
			connection.query("UPDATE map SET name = ? WHERE id = ?",[this.name, this.id], function(err, res){
				callback(err == null);
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
			
				tileData[i] = { 'x': rows[i].x, 'y': rows[i].y, 'layer': rows[i].layer, 'tileset': rows[i].tileset_id }; 
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
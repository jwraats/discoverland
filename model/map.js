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
	setId : function(id) {
		this.id = id;
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
		if(this.id == 0) {
			connection.query("INSERT INTO map(name) VALUE(?,?)",[this.name], function(err, res){
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
		console.log('Load all');
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
	}
	jsonWithTileset:function(connecion, callback) {
		var map = this;
		connection.query("SELECT * FROM mapTiles WHERE map_id = ?",[map.id], function(err, rows){
			if(err != null || rows == undefined) {
				callback(false, null);
				return false;
			}
			
			var returnData = {};
			
			for(i = 0; i < rows.length; i++) {
			
				results[i] = { 'x': rows[i].x, 'y': rows[i].y, 'layer': rows[i].layer, 'tileset': rows[i].tileset_id }; 
			}
			
			callback(true, { 'id': this.id, 'name': this.name, 'tiles': returnData });
		});
	}
	
};

// node.js module export
module.exports = new map(); 
// Constructor
var tileset = function() {
};

// properties and methods
tileset.prototype = {
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
	getPath : function() {
		return '/tilesetImg/' + this.id + '.png';
	},
	getTileSize : function() {
		return this.tileSize;
	},
	setTileSize : function(size) {
		this.tileSize = size;
	},
	delete : function(connection, callback) {
		if(this.id == 0) {
			callback(false);
			return;
		}
			
		connection.query("DELETE FROM tileset WHERE id = ?",[this.id], function(err, res){
			callback(err == null);
		});
	},
	save : function(connection, callback) {
		var tileset = this;
		if(this.id == 0 || this.id == undefined) {
			connection.query("INSERT INTO tileset(name,tileSize) VALUE(?,?)",[this.name, this.tileSize], function(err, res){
				tileset.id = res.insertId;
				callback(err == null);
			});
		}
		else {
			connection.query("UPDATE tileset SET name = ? ,tileSize = ? WHERE id = ?",[this.name, this.tileSize, this.id], function(err, res){
				callback(err == null);
			});
		}
	},
	loadAll : function(connection, callback) {
		console.log('Load all');
		connection.query("SELECT * FROM tileset",[], function(err, rows){
			if(err != null || rows == undefined) {
				callback(false, null);
				return;
			}
			
			var results = new Array();
			
			for(i = 0; i < rows.length; i++) {
				var object = new tileset();
				object.loadData(rows[i]);
				results[i] = object;
			};
			callback(true, results);
			
		});
	},
	load:function(connection, id, callback) {
	var tileset = this;
		connection.query("SELECT * FROM tileset WHERE id = ?",[id], function(err, rows){
			if(err != null || rows == undefined || rows.length != 1) {
				callback(false);
				return false;
			}
			
			tileset.loadData(rows[0]);
			callback(true);
		});
	},
	loadData:function(data) {
		this.id = data.id;
		this.name = data.name;
		this.tileSize = data.tileSize;
	},
	json:function() {
		return { 'id': this.id, 'name': this.name, 'path': this.getPath(), 'tileSize': this.tileSize};
	},
	clear:function() {
		this.id = undefined;
		this.name = undefined;
		this.tileSize = undefined;
	}
	
};

// node.js module export
module.exports = new tileset();
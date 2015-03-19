var Layer = function (x, y, layer, tile, tileset) {
	this.x = x;
	this.y = y;
	this.layer = layer;
	this.tile = tile;
	this.tileset = tileset;
};

var Tileset = function (id, name, path, tileSize) {
	this.id = id;
	this.name = name;
	this.path = path;
	this.tileSize = tileSize;
	this.row = {'width': 0, 'height': 0};
	this.total = 0;
	this.Image = 0;
	this.defaultTile = 0;

	this.loadImage = function(onload){
		Mapeditor.activeTileset.Image = new Image();
		Mapeditor.activeTileset.Image.src = this.path;
		Mapeditor.activeTileset.Image.onload = onload;
	};
	this.CalcTotal = function(){
		this.row.width = this.Image.width / this.tileSize;
		this.row.height = this.Image.height / this.tileSize;
		this.total = this.row.width * this.row.height;
	};
};
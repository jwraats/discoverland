var Mapeditor = {};
Mapeditor.tileset = {};
Mapeditor.tileset.src = "";
Mapeditor.tileset.tileSize = 32;
Mapeditor.mapSetup = {};
Mapeditor.mapSetup.layers = [];

//Toolbar
Mapeditor.tools = {};
Mapeditor.tools.activeLayer = 2;
Mapeditor.tools.activeTile = 79;


Mapeditor.init = function(){
	var canvas = document.getElementById('main');
	Mapeditor.canvas = canvas.getContext('2d');
	Mapeditor.createRandomGround();

	Mapeditor.tileset.Image = new Image();
	Mapeditor.tileset.Image.src = './img/tileset.png';
	Mapeditor.tileset.Image.onload = Mapeditor.initTileset;
	Mapeditor.bindClick();
};

Mapeditor.initTileset = function(){
	Mapeditor.tileset.numTiles = Mapeditor.tileset.Image.width / Mapeditor.tileset.tileSize;
	Mapeditor.drawToolbar();
	Mapeditor.drawMap();
};

Mapeditor.drawToolbar = function(){
	var $toolbar = $('#canvasToolbar');
	var countTile = Mapeditor.tileset.numTiles * (Mapeditor.tileset.Image.height / Mapeditor.tileset.tileSize);
	var maxX = Math.floor($toolbar.innerWidth() / Mapeditor.tileset.tileSize);
	var maxY = Math.ceil(countTile / maxX);
	//$toolbar.height(maxY * Mapeditor.tileset.tileSize);

	var canvasToolbar = $toolbar[0];
	Mapeditor.toolbarCanvas = canvasToolbar.getContext('2d');

	var drawTile = 0;
	for(var x = 0; x < maxX; x++){
		for(var y = 0; y < maxY; y++){
			console.log('x: '+x+' y: '+y+' draw:'+drawTile);
			Mapeditor.drawImage(drawTile, x, y, Mapeditor.toolbarCanvas);
			drawTile++;

			//Create grid (horizontal)
			Mapeditor.toolbarCanvas.moveTo(0, y * Mapeditor.tileset.tileSize);
			Mapeditor.toolbarCanvas.lineTo($toolbar.innerWidth(), y* Mapeditor.tileset.tileSize);
			Mapeditor.toolbarCanvas.stroke();
		}
		//Create grid (vertical)
		Mapeditor.toolbarCanvas.moveTo(x * Mapeditor.tileset.tileSize, 0);
		Mapeditor.toolbarCanvas.lineTo(x * Mapeditor.tileset.tileSize, $toolbar.innerHeight());
		Mapeditor.toolbarCanvas.stroke();
	}

};

Mapeditor.drawMap = function(){
	var $map = $('#main');
	Mapeditor.canvas.lineWidth = 1
	Mapeditor.canvas.strokeStyle = '#e2e2e2';
	Mapeditor.canvas.clearRect ( 0 , 0 , $map.innerWidth(), $map.innerHeight());
	for(var x = 0; x < ($map.innerWidth() / Mapeditor.tileset.tileSize); x++){
		for(var y = 0; y < ($map.innerHeight() / Mapeditor.tileset.tileSize); y++){
			//Draw  all layers
			$.each(Mapeditor.mapSetup.layers, function(l, layer ){
				if(l <= Mapeditor.tools.activeLayer){	//Only go to active layers so don't see upper layers then!
					if(layer[y] !== undefined && layer[y][x] !== undefined){
						Mapeditor.drawImage(layer[y][x], x, y);
					}
				}
			});
			//Create grid (horizontal)
			Mapeditor.canvas.moveTo(0, y * Mapeditor.tileset.tileSize);
			Mapeditor.canvas.lineTo($map.innerWidth(), y* Mapeditor.tileset.tileSize);
			Mapeditor.canvas.stroke();
		}
		//Create grid (vertical)
		Mapeditor.canvas.moveTo(x * Mapeditor.tileset.tileSize, 0);
		Mapeditor.canvas.lineTo(x * Mapeditor.tileset.tileSize, $map.innerHeight());
		Mapeditor.canvas.stroke();
	}
};

Mapeditor.changeActiveLayer = function(layer){
	if(layer <= Mapeditor.mapSetup.layers.length){
		Mapeditor.tools.activeLayer = layer;
		//Redraw map
		Mapeditor.drawMap();
	}
};

Mapeditor.bindClick = function(){
	var $canvas = $('#main');
	$canvas.on('click', function(event){
		var x = Math.floor((event.clientX - $canvas.offset().left) / Mapeditor.tileset.tileSize);
		var y = Math.floor((event.clientY - $canvas.offset().top) / Mapeditor.tileset.tileSize);

		Mapeditor.mapSetup.layers[Mapeditor.tools.activeLayer][y][x] = Mapeditor.tools.activeTile;
		Mapeditor.drawImage(Mapeditor.tools.activeTile, x, y);
	});
};

Mapeditor.drawImage = function(value, x, y, canvas){
	if(canvas === undefined){
		canvas = Mapeditor.canvas;
	}
	//canvas.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
	canvas.drawImage(
		Mapeditor.tileset.Image,
		(((value % Mapeditor.tileset.numTiles) | 0) * Mapeditor.tileset.tileSize),
		(((value / Mapeditor.tileset.numTiles) | 0) * Mapeditor.tileset.tileSize),
		Mapeditor.tileset.tileSize,
		Mapeditor.tileset.tileSize,
		(x * Mapeditor.tileset.tileSize),
		(y * Mapeditor.tileset.tileSize),
		Mapeditor.tileset.tileSize,
		Mapeditor.tileset.tileSize
	);
};

Mapeditor.createRandomGround = function(){
	Mapeditor.mapSetup.layers = [
	// [
	// 	[172, 172, 172, 79, 34, 34, 34, 34, 34, 34, 34, 34, 56, 57, 54, 55, 56, 147, 67, 67, 68, 79, 79, 171, 172, 172, 173, 79, 79, 55, 55, 55],
	// 	[172, 172, 172, 79, 34, 34, 34, 34, 34, 34, 146, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 155, 142, 172, 159, 189, 79, 79, 55, 55, 55],
	// 	[172, 172, 172, 79, 79, 34, 34, 34, 34, 34, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 159, 189, 79, 79, 79, 55, 55, 55],
	// 	[188, 188, 188, 79, 79, 79, 79, 34, 34, 34, 36, 172, 172, 143, 142, 157, 79, 79, 79, 79, 79, 79, 187, 159, 189, 79, 79, 79, 55, 55, 55, 55],
	// 	[79, 79, 79, 79, 79, 79, 79, 79, 34, 34, 36, 172, 159, 158, 172, 143, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 39, 51, 51, 51, 55, 55],
	// 	[79, 79, 79, 79, 79, 79, 79, 79, 79, 34, 36, 172, 143, 142, 172, 172, 143, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 55],
	// 	[79, 79, 79, 79, 79, 79, 79, 79, 79, 34, 52, 172, 172, 172, 172, 172, 172, 143, 156, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79],
	// 	[79, 79, 79, 79, 79, 79, 79, 79, 79, 34, 52, 172, 172, 172, 172, 172, 172, 159, 188, 189, 79, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79],
	// 	[79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 188, 158, 172, 172, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 187, 158, 159, 189, 79, 79, 79],
	// 	[79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172, 159, 188, 189, 79, 79, 79, 79, 79, 79, 79, 79, 171, 173, 79, 79, 79, 79],
	// 	[79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 173, 79, 79, 79, 79],
	// 	[155, 142, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 187, 188, 188, 189, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 173, 79, 79, 79, 79],
	// 	[171, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 173, 79, 79, 79, 79],
	// 	[171, 172, 143, 156, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 187, 189, 79, 79, 79, 79],
	// 	[187, 188, 158, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79],
	// 	[79, 79, 79, 188, 189, 79, 79, 79, 79, 79, 79, 155, 156, 156, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 155, 156],
	// 	[34, 34, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 155, 142, 172],
	// 	[34, 34, 34, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172],
	// 	[34, 34, 34, 34, 79, 79, 79, 79, 79, 79, 155, 172, 172, 159, 189, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172],
	// 	[34, 34, 34, 34, 34, 34, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 155, 142, 172, 172]
	// ],
	// [
	// 	[0, 0, 32, 33, 0, 236, 0, 0, 236, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 69, 0, 0, 0, 0, 0, 32, 33],
	// 	[0, 0, 48, 49, 0, 236, 220, 220, 236, 0, 0, 147, 72, 73, 70, 71, 72, 73, 83, 83, 84, 85, 0, 0, 0, 0, 0, 48, 49],
	// 	[0, 0, 64, 65, 54, 0, 236, 236, 0, 0, 162, 163, 84, 89, 86, 87, 88, 89, 99, 99, 100, 101, 0, 0, 0, 0, 7, 112, 113],
	// 	[0, 0, 80, 81, 70, 54, 55, 50, 0, 0, 0, 179, 100, 105, 102, 103, 104, 105, 0, 0, 0, 0, 0, 0, 16, 22, 23, 39],
	// 	[0, 0, 96, 97, 86, 70, 65, 144, 193, 0, 0, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 49],
	// 	[0, 0, 0, 0, 102, 86, 81, 160, 161, 0, 0, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 65, 174, 175, 67, 66, 54],
	// 	[0, 0, 0, 0, 0, 102, 97, 176, 177, 0, 0, 37, 0, 252, 0, 0, 0, 201, 202, 0, 0, 0, 0, 0, 80, 81, 190, 191, 83, 82, 70, 71],
	// 	[0, 0, 0, 0, 0, 0, 0, 48, 49, 0, 0, 53, 0, 0, 0, 0, 0, 217, 218, 0, 0, 0, 0, 0, 96, 97, 222, 223, 99, 98, 86, 87],
	// 	[201, 202, 0, 0, 0, 0, 0, 64, 65, 66, 68, 69, 0, 0, 0, 0, 0, 233, 234, 0, 0, 0, 0, 0, 238, 239, 0, 0, 238, 239, 102, 103],
	// 	[217, 218, 0, 0, 0, 0, 0, 80, 81, 82, 84, 85, 0, 0, 0, 0, 0, 249, 250, 0, 0, 0, 0, 0, 254, 255, 0, 0, 254, 255],
	// 	[233, 234, 0, 0, 0, 0, 0, 96, 97, 98, 100, 101, 0, 0, 0, 0, 0, 0, 0],
	// 	[249, 250, 0, 0, 201, 202, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 238, 239, 0, 0, 238, 239],
	// 	[0, 0, 0, 0, 217, 218, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 254, 255, 0, 0, 254, 255],
	// 	[0, 0, 0, 0, 233, 234, 196, 197, 198],
	// 	[2, 3, 4, 0, 249, 250, 228, 229, 230],
	// 	[18, 19, 20, 8, 0, 0, 244, 245, 246, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 201, 202],
	// 	[0, 35, 40, 24, 25, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 217, 218],
	// 	[0, 0, 0, 40, 41, 20, 8, 9, 0, 0, 0, 0, 0, 0, 0, 16, 17, 18, 19, 20, 21, 0, 0, 0, 0, 0, 0, 0, 233, 234],
	// 	[0, 0, 0, 0, 40, 19, 24, 25, 8, 9, 0, 0, 0, 0, 0, 48, 49, 50, 51, 52, 115, 3, 4, 0, 0, 0, 0, 0, 249, 250],
	// 	[0, 0, 0, 0, 0, 0, 40, 41, 20, 21, 0, 0, 0, 0, 0, 64, 65, 66, 67, 52, 19, 19, 20, 21]
	// ],
	// [
	// 	[0, 0, 0, 0, 0, 220, 0, 0, 220],
	// 	[],
	// 	[],
	// 	[],
	// 	[],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 201, 202],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 217, 218],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 233, 234],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 249, 250],
	// 	[],
	// 	[],
	// 	[],
	// 	[],
	// 	[],
	// 	[],
	// 	[],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 196, 197, 198],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 228, 229, 230],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 244, 245, 246],
	// 	[]
	// ]
	];
};

$(function() {
	Mapeditor.init();
});

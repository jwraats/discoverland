var Mapeditor = {};
Mapeditor.activeTileset = {};
Mapeditor.mapSetup = {};
Mapeditor.mapSetup.layers = [];
Mapeditor.mouse = {};
Mapeditor.mouse.down = {};
Mapeditor.mouse.up = {};

//Object storage
Mapeditor.maps = [];

//Toolbar
Mapeditor.tools = {};
Mapeditor.tools.activeLayer = 2;
Mapeditor.tools.activeTile = 79;

Mapeditor.getTilesAndMaps = function(){
	///api/map
	$.ajax({
		url: "/api/map",
		success: function(maps){
			Mapeditor.maps = maps.data;
			$("#maps").html('<option>Selecteer een map... of maak een nieuwe</option>');
			$.each(Mapeditor.maps, function( i, item ){
				$("#maps").append('<option value="'+item.id+'">'+item.name+'</option>');
				console.log(item);
			});
		}
	});
	
};

Mapeditor.init = function(){
	Mapeditor.getTilesAndMaps();
	var $footer = $('footer.footer');
	var $canvas = $('#main');
	$canvas.attr('height', $footer.height());
	$canvas.attr('width', $('#map section').width());

	var canvas = document.getElementById('main');
	Mapeditor.canvas = canvas.getContext('2d');
	Mapeditor.activeTileset = new Tileset(1, 'World', './img/tileset.png', 32);
	Mapeditor.activeTileset.defaultTile = 79;
	Mapeditor.activeTileset.loadImage(Mapeditor.initTileset);
};

Mapeditor.defineMap = function(){
	//AJAX call to api
	Mapeditor.mapSetup.layers.push(new Layer(0, 0, 1, 79, Mapeditor.activeTileset));
	Mapeditor.mapSetup.layers.push(new Layer(0, 10, 1, 79, Mapeditor.activeTileset));
	Mapeditor.mapSetup.layers.push(new Layer(10, 10, 1, 79, Mapeditor.activeTileset));
};

Mapeditor.initTileset = function(){
	Mapeditor.activeTileset.CalcTotal();
	Mapeditor.defineMap();
	Mapeditor.drawToolbar();
	Mapeditor.drawMap();
	Mapeditor.bindClick();
};

Mapeditor.drawToolbar = function(){
	var $toolbar = $('#canvasToolbar');
	var maxX = Math.floor($toolbar.innerWidth() / Mapeditor.activeTileset.tileSize);
	var maxY = Math.ceil(Mapeditor.activeTileset.total / maxX);
	$toolbar.attr('height', maxY * Mapeditor.activeTileset.tileSize);

	var canvasToolbar = $toolbar[0];
	Mapeditor.toolbarCanvas = canvasToolbar.getContext('2d');

	var drawTile = 0;
	for(var x = 0; x < maxX; x++){
		for(var y = 0; y < maxY; y++){
			Mapeditor.drawImage(drawTile, x, y, Mapeditor.toolbarCanvas);
			drawTile++;

			//Create grid (horizontal)
			Mapeditor.toolbarCanvas.moveTo(0, y * Mapeditor.activeTileset.tileSize);
			Mapeditor.toolbarCanvas.lineTo($toolbar.innerWidth(), y* Mapeditor.activeTileset.tileSize);
			Mapeditor.toolbarCanvas.stroke();
		}
		//Create grid (vertical)
		Mapeditor.toolbarCanvas.moveTo(x * Mapeditor.activeTileset.tileSize, 0);
		Mapeditor.toolbarCanvas.lineTo(x * Mapeditor.activeTileset.tileSize, $toolbar.innerHeight());
		Mapeditor.toolbarCanvas.stroke();
	}

};

Mapeditor.drawMap = function(){
	var $map = $('#main');
	Mapeditor.canvas.lineWidth = 1;
	Mapeditor.canvas.strokeStyle = '#e2e2e2';
	Mapeditor.canvas.clearRect ( 0 , 0 , $map.innerWidth(), $map.innerHeight());
	for(var x = 0; x < ($map.innerWidth() / Mapeditor.activeTileset.tileSize); x++){
		for(var y = 0; y < ($map.innerHeight() / Mapeditor.activeTileset.tileSize); y++){
			//Draw  all layers
			$.each(Mapeditor.mapSetup.layers, function(i, layer ){
				if(layer.layer <= Mapeditor.tools.activeLayer){	//Only go to active layers so don't see upper layers then!
					Mapeditor.drawLayer(layer);
				}
			});
			//Create grid (horizontal)
			Mapeditor.canvas.moveTo(0, y * Mapeditor.activeTileset.tileSize);
			Mapeditor.canvas.lineTo($map.innerWidth(), y* Mapeditor.activeTileset.tileSize);
			Mapeditor.canvas.stroke();
		}
		//Create grid (vertical)
		Mapeditor.canvas.moveTo(x * Mapeditor.activeTileset.tileSize, 0);
		Mapeditor.canvas.lineTo(x * Mapeditor.activeTileset.tileSize, $map.innerHeight());
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
		var bcr = $canvas[0].getBoundingClientRect();
		var x = Math.floor((event.clientX - bcr.left) / Mapeditor.activeTileset.tileSize);
		var y = Math.floor((event.clientY - bcr.top) / Mapeditor.activeTileset.tileSize);
		Mapeditor.mapSetup.layers.push(addLayer = new Layer(x, y, Mapeditor.tools.activeLayer, Mapeditor.tools.activeTile));
		Mapeditor.drawLayer(addLayer);
	});

	$canvas.on('mousedown', function(event){
		var bcr = $canvas[0].getBoundingClientRect();
		Mapeditor.mouse.down = {
			'x': Math.floor((event.clientX - bcr.left) / Mapeditor.activeTileset.tileSize),
			'y': Math.floor((event.clientY - bcr.top) / Mapeditor.activeTileset.tileSize)
		};
	});

	$canvas.on('mouseup', function(event){
		var bcr = $canvas[0].getBoundingClientRect();
		Mapeditor.mouse.up = {
			'x': Math.floor((event.clientX - bcr.left) / Mapeditor.activeTileset.tileSize),
			'y': Math.floor((event.clientY - bcr.top) / Mapeditor.activeTileset.tileSize)
		};
		if(Mapeditor.mouse.up.x !== Mapeditor.mouse.down.x &&
		Mapeditor.mouse.up.y !== Mapeditor.mouse.down.y){
			//FOR LOOP INBETWEEN
			if(Mapeditor.mouse.up.x > Mapeditor.mouse.down.x &&
			Mapeditor.mouse.up.y > Mapeditor.mouse.down.y){
				for(var x = Mapeditor.mouse.down.x; x < Mapeditor.mouse.up.x; x++){
					for(var y = Mapeditor.mouse.down.y; y < Mapeditor.mouse.up.y; y++){
						Mapeditor.mapSetup.layers.push(addLayer = new Layer(x, y, Mapeditor.tools.activeLayer, Mapeditor.tools.activeTile));
					}
				}
			}
			console.log('UP: '+Mapeditor.mouse.up.x+','+Mapeditor.mouse.up.y+' DOWN: '+Mapeditor.mouse.down.x+','+Mapeditor.mouse.down.y);
			Mapeditor.mouse.up = [];
			Mapeditor.mouse.down = [];
		}

	});

	var $toolbar = $('#canvasToolbar');
	var maxToolbarY = Math.floor($toolbar.innerHeight() / Mapeditor.activeTileset.tileSize);
	$toolbar.on('click', function(event){
		var bcr = $toolbar[0].getBoundingClientRect();
		var x = Math.floor((event.clientX - bcr.left) / Mapeditor.activeTileset.tileSize);
		var y = Math.floor((event.clientY - bcr.top) / Mapeditor.activeTileset.tileSize);
		Mapeditor.tools.activeTile = ((x*maxToolbarY) + y);
	});
};

Mapeditor.drawLayer = function(layer){
	Mapeditor.drawImage(layer.tile, layer.x, layer.y, null, layer.tileset);
};

Mapeditor.drawImage = function(value, x, y, canvas, tileset){
	if(canvas === undefined || canvas === null){
		canvas = Mapeditor.canvas;
	}
	if(tileset === undefined || tileset === null){
		tileset = Mapeditor.activeTileset;
	}
	//canvas.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
	canvas.drawImage(
		tileset.Image,
		(((value % tileset.row.width ) | 0) * tileset.tileSize),
		(((value / tileset.row.width ) | 0) * tileset.tileSize),
		tileset.tileSize,
		tileset.tileSize,
		(x * tileset.tileSize),
		(y * tileset.tileSize),
		tileset.tileSize,
		tileset.tileSize
	);
};
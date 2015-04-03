var TilesetManager = function() {
};

TilesetManager.prototype = {
	id: 0,
	table: null,
	init:function() {
		this.table = $('#tilesetTable').dataTable();
		this.id = 0;
	},
	loadAll:function() {	
		var table = this.table;
		oSettings = table.fnSettings();
		table.fnClearTable(this);
		
		
		$.get('/api/tileset', function(data) {
			if(data.success) {
				$.each(data.data, function(index, row) {
					table.oApi._fnAddData(oSettings, [row.id, row.name, row.tileSize, '<button class="btn btn-default" id="new" type="submit" onclick="tilesetManager.load(' + row.id + ');">Aanpassen</button>', '<button class="btn btn-default" id="new" type="submit" onclick="tilesetManager.remove(' + row.id + ');">Verwijderen</button>']);
				});
				
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
				table.fnDraw();
			}
		});
	},
	load:function(id) {
		this.id = id;
		if(id != 0) {
			$.get('/api/tileset/' + id, function(data) {
				if(data.success) {				
					loadPage('tilesetEdit.html', function() {
						$('#tilesetName').val(data.data.name);
						$('#tilesetSize').val(data.data.tileSize);
						$('#tilesetImg').attr("src",data.data.path + '?' + new Date().getTime());
						tilesetManager.loadForm();
					});
				}
			});
		}
		else {
			loadPage('tilesetEdit.html', function() {
				tilesetManager.loadForm();
			});
		}
	},
	loadForm:function() {
		
		if(this.id == 0)
			$('#tilesetImgPlaceholder').hide();
		else
			$('#tilesetImgPlaceholder').show();
		
		$('#tilesetForm').submit(function(e){
			var url = '/api/tileset/' + tilesetManager.id;
			var type = 'PUT';
			
			if(tilesetManager.id == 0) {
				url = '/api/tileset';
				type = 'POST';
			}
			
			$.ajax({
				url: url,
				type: type,
				data: new FormData( this ),
				processData: false,
				contentType: false
			}).done(function( data ) {
				loadPage('tileset.html', function() {
					load('tileset.html');
				});
			});
			e.preventDefault();
		});
	},
	remove:function(id) {
		$.ajax({
				url: '/api/tileset/' + id,
				type: 'DELETE',
			}).done(function( data ) {
				tilesetManager.loadAll();
			});
	}
};

var tilesetManager = new TilesetManager();
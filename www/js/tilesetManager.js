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
		
		$.ajax({
			url: '/api/tileset',
			type: 'GET',
			beforeSend: function(request){request.setRequestHeader("X-Access-Token", token);}
		}).done(function(data) {
			if(data.success) {
				$.each(data.data, function(index, row) {
					table.oApi._fnAddData(oSettings, [row.id, row.name, row.tileSize, '<button class="btn btn-default" id="new" type="submit" onclick="tilesetManager.load(' + row.id + ');">Aanpassen</button>', '<button class="btn btn-default" id="new" type="submit" onclick="tilesetManager.remove(' + row.id + ');">Verwijderen</button>']);
				});
				
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
				table.fnDraw();
			}
			else {
				error('Kon de tilesets niet laden!');
			}
		}).fail(function(e) {
			error('Onbekende fout!');
		});
	},
	load:function(id) {
		this.id = id;
		if(id != 0) {
			$.ajax({
				url: '/api/tileset/' + id,
				type: 'GET',
				beforeSend: function(request){request.setRequestHeader("X-Access-Token", token);}
			}).done(function(data) {			
				loadPage('tilesetEdit.html', function() {
					$('#tilesetName').val(data.data.name);
					$('#tilesetSize').val(data.data.tileSize);
					$('#tilesetImg').attr("src",data.data.path + '?' + new Date().getTime());
					tilesetManager.loadForm();
				});
			}).fail(function(e) {
				if(e.status == 404) {
					error('De tileset is niet gevonden!');
				}
				else {
					error('Onbekende fout!');
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
				beforeSend: function (request){request.setRequestHeader("X-Access-Token", token);},
				data: new FormData( this ),
				processData: false,
				contentType: false
			}).done(function( data ) {
				if(data.success) {
					success('Wijzigingen opgeslagen.');
					loadPage('tileset.html', function() {
						load('tileset.html');
					});
				}
				else {
					error('Kon de wijzigingen niet opslaan!');
				}
			}).fail(function(e){
				if(e.status == 422) {
					error('Niet alle verplichte velden zijn ingevuld!');
				}
				else if(e.status == 404) {
					error('De tileset is niet gevonden!');
				}
				else {
					error('Onbekende fout!');
				}
			});
			e.preventDefault();
		});
	},
	remove:function(id) {
		$.ajax({
			url: '/api/tileset/' + id,
			type: 'DELETE',
			beforeSend: function(request){request.setRequestHeader("X-Access-Token", token);}
		}).done(function(data) {
			success('Tileset verwijderd.');
			tilesetManager.loadAll();
		}).fail(function(e) {
			if(e.status == 404) {
				error('De tileset is niet gevonden!');
			}
			else {
				error('Onbekende fout!');
			}
		});
	}
};

var tilesetManager = new TilesetManager();
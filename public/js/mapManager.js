var MapManager = function() {
};

MapManager.prototype = {
	id: 0,
	table: null,
	init:function() {
		this.table = $('#mapTable').dataTable();
		this.id = 0;
	},
	loadAll:function() {	
		var table = this.table;
		oSettings = table.fnSettings();
		table.fnClearTable(this);
		
		$.ajax({
			url: '/api/map',
			type: 'GET',
			beforeSend: function(request){request.setRequestHeader("X-Access-Token", token);}
		}).done(function(data) {
			if(data.success) {
				$.each(data.data, function(index, row) {
					table.oApi._fnAddData(oSettings, [row.id, row.name, '<button class="btn btn-default" id="new" type="submit" onclick="mapManager.load(' + row.id + ');">Aanpassen</button>', '<button class="btn btn-default" id="new" type="submit" onclick="mapManager.remove(' + row.id + ');">Verwijderen</button>']);
				});
				
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
				table.fnDraw();
			}
			else {
				error('Kon de maps niet laden!');
			}
		}).fail(function(e) {
			error('Onbekende fout!');
		});
	},
	load:function(id) {
		this.id = id;
		if(id != 0) {
			$.ajax({
				url: '/api/map/' + id,
				type: 'GET',
				beforeSend: function(request){request.setRequestHeader("X-Access-Token", token);}
			}).done(function(data) {
				if(data.success) {				
					loadPage('index.html', function() {
						mapManager.loadForm();
					});
				}
				else {
					error('Kon de map niet laden!');
				}
			}).fail(function(e) {
				if(e.status == 404) {
					error('De map is niet gevonden!');
				}
				else {
					error('Onbekende fout!');
				}
			});
		}
		else {
			loadPage('index.html', function() {
				mapManager.loadForm();
			});
		}
	},
	loadForm:function() {
		Mapeditor.init();
	},
	remove:function(id) {
		$.ajax({
			url: '/api/map/' + id,
			type: 'DELETE',
			beforeSend: function(request){request.setRequestHeader("X-Access-Token", token);}
		}).done(function(data) {
				success('Map verwijderd.');
				mapManager.loadAll();
		}).fail(function(e) {
			if(e.status == 404) {
				error('De map is niet gevonden!');
			}
			else {
				error('Onbekende fout!');
			}
		});
	}
};

var mapManager = new MapManager();
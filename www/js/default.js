$(document).ready(function() {
	$('nav ul li a').click(function(e) {
		e.preventDefault();
		
		var url = $(this).attr('href');
		
		loadPage(url, function() {
			load(url);
		});
			
	});
	$('nav ul li a:first').trigger('click');
});

function loadPage(url, callback) {
	$.get('/pages/' + url, function( data ) {
		var container = $( "#container" );
		container.fadeOut('fast', function() {
			container.html( data );
			callback();
			container.fadeIn('fast', function(){
			});
		});
	});
}

function load(url) {
	if(url == 'index.html') {
		Mapeditor.init();
	}
	else if(url == 'tileset.html') {
		tilesetManager.init();
		tilesetManager.loadAll();
	}
}
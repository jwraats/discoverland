var token = '';

$(document).ready(function() {
	$('nav ul li a').click(function(e) {
		e.preventDefault();
		
		if(token == '') {
			gotoLogin();
			return;
		}
		
		var url = $(this).attr('href');
		
		loadPage(url, function() {
			load(url);
		});
			
	});
	gotoLogin();
});

function gotoLogin() {
	loadPage('login.html', function() {
		$('#loginForm').submit(function(e){
			$.ajax({
				url: '/api/login',
				type: 'POST',
				data: new FormData( this ),
				processData: false,
				contentType: false
			}).done(function( data ) {
				token = data.token;
				$('nav ul li:first a').trigger('click');
			});
			e.preventDefault();
		});
	});
}

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
	else if(url == 'map.html') {
		mapManager.init();
		mapManager.loadAll();
	}
}
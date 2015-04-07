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
				success('Successvol ingelogd');
				$('nav ul li:first a').trigger('click');
			}).fail(function(e) {
				if(e.status == 401)
					error('Gebruikersnaam/wachtwoord ongeldig!');
				else
					error('Onbekende fout!');
			});
			e.preventDefault();
		});
	});
}

function loadPage(url, callback) {
	$.ajax({
		url: '/pages/' + url,
		type: 'GET',
	}).done(function(data) {
		var container = $( "#container" );
		container.fadeOut('fast', function() {
			container.html( data );
			callback();
			container.fadeIn('fast', function(){
			});
		});
	}).fail(function(e) {
		error('Onbekende fout!');
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

function success(message) {
	var content = $('<div class="alert alert-success alert-dismissible" role="alert">' +
	'	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
	'	<strong>Gelukt!</strong> ' + message +
	'</div>');
	$('#messages').append(content);
	
	setTimeout((function(){ content.fadeOut('slow') }), 2000);
}

function error(message) {
	var content = $('<div class="alert alert-danger alert-dismissible" role="alert">' +
	'	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
	'	<strong>Fout!</strong> ' + message +
	'</div>');
	$('#messages').append(content);
	
	setTimeout((function(){ content.fadeOut('slow') }), 2000);
}
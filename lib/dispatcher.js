/*
 * /lib/dispatcher.js
 */
var fs                      = require('fs');
var url                     = require('url');
var controller            = require('./controller');
var response_handler = require('./response_handler');

this.dispatch = function(req, res) {

	//set up response object
	responseHandler = new response_handler(res);

	var requestedUrl = url.parse(req.url);
    var parts, action, argument;

	if (requestedUrl.pathname == '/') {
		action = 'home';
	}
	else {
		parts    = req.url.split('/');
		action   = parts[1];
		argument = parts[2];
	}
	
	//only executing registered actions
	if (typeof controller[action] == 'function') {
		try {
			controller[action](argument, function(content) {
				if (content) {
					responseHandler.renderHtml(content);
				}
				else {
					responseHandler.serverError(404);
				}
			});

		}
		catch (error) {
			console.log(error);
		}
	}
	else {
		responseHandler.renderWebroot(requestedUrl);
	}
};

/*var fs = require('./fs.js');
var actions = {
  'view' : function(user) {
    return '<h1>Todos for ' + user + '</h1>';
  }
}

this.dispatch = function(req, res) {
  //some private methods
  var serverError = function(code, content) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(content);
  }

  var renderHtml = function(content) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content, 'utf-8');
  }

  var parts = req.url.split('/');

  if (req.url == "/") {
    fs.readFile('./lib/webroot/index.html', function(error, content) {
      if (error) {
        serverError(500, '500 Internal server error');
      } else {
        renderHtml(content);
      }
    });

  } else {
    var action   = parts[1];
    var argument = parts[2];

    if (typeof actions[action] == 'function') {
      var content = actions[action](argument);
      renderHtml(content);
    } else {
      serverError(404, '404 Bad Request');
    }
  }
}*/
//include our modules
var sys   = require('sys');
var http  = require('http');
var url   = require('url');

//require custom dispatcher
var dispatcher = require('./lib/dispatcher.js');

console.log('Starting server @ http://127.0.0.1:8088/');

http.createServer(function (req, res) {
  //wrap calls in a try catch
  //or the node js server will crash upon any code errors
  try {
    //pipe some details to the node console
    console.log('Incoming Request from: ' +
                 req.connection.remoteAddress +
                ' for href: ' + url.parse(req.url).href
    );
	
	var body = "";
	req.on('data', function (chunk) {
		body += chunk;
	});
	req.on('end', function () {
		console.log('POSTed: ' + body);
		//dispatch our request
		req.post = body;
		dispatcher.dispatch(req, res);
  });

  } catch (err) {
      //handle errors gracefully
      sys.puts(err);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }).listen(8088);
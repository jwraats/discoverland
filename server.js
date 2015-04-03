// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    	= require('express');        // call express
var app        	= express();                 // define our app using express
var bodyParser 	= require('body-parser');
var mysql		= require('mysql');
var path		= require('path');
var multer 		= require('multer');
var fs 			= require('fs');

var connection = mysql.createConnection(
{
	host : 'localhost',
	user : 'discoverland',
	password : 'd1sc0v3rl4nd',
	database : 'discoverland'
});
app.set('dbConnection', connection);
app.set('rootDir', __dirname);


app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
}
}));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8088;        // set our port

//Create endware
express.response.clearTmp = function() {
	if(this.req.files != undefined) {
		var req = this.req;
		Object.keys(this.req.files).forEach(function(element, key, _array) {
			fs.unlink(req.files[element].path);		
		});
	}
};

// ROUTES FOR OUR API
// =============================================================================
//var router = express.Router();              // get an instance of the express Router

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', require('./routes/index.js'));

// Static files
app.use(express.static(__dirname + '/www'));


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


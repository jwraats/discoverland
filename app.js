//Require
var express = require('express');        // call express
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser	= require('body-parser');
var multer = require('multer');
var exphbs  = require('express-handlebars');
var fs = require('fs');

//app start
var app = express();

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.set('rootDir', __dirname);

//Genral stuff
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Multer
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


//Create endware
express.response.clearTmp = function() {
	if(this.req.files != undefined) {
		var req = this.req;
		Object.keys(this.req.files).forEach(function(element, key, _array) {
			var path = req.files[element].path;
			fs.unlink(path, function(e) {});		
		});
	}
};

//Include routes
var api = require('./routes/api');
var auth = require('./routes/auth');

/*
 * /api/login is the only route without auth, /api/login generates API key
 */
app.post('/api/login', auth.login);

// All other /api/* API request routing via JWT validation
//app.all('/api/*', auth.tokenValidator);

// all of our routes will be prefixed with /api
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

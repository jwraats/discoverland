/*
 * /lib/controller.js
 */
/*var controller = function() {};

controller.prototype = {
    'view' : function(user) {
      return '<h1>Todos for ' + user + '</h1>';
    }
  };

  
module.exports = new controller();*/

var view = require('./view');
var controller = function() {};

controller.prototype = {
	view : function(user, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};
		var data = {
			'user' : user ? user : 'nobody'
		};

		view.renderView('view', data, function(data) {
			callback(data);
		});
	},

	home : function(arg, callback) {
		var callback = (typeof callback === 'function') ? callback : function() {};

		var data = {
			'users' : {
				'name'    : 'James',
				'viewLink': '/view/james/'
			}
		};

		view.renderView('home', data, function(data) {
			callback(data);
		});
	},
};

module.exports = new controller();
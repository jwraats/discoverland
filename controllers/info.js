var info = {
	hi: function(req, res) {
		res.json({h:"a"});
	}
/*	exportMeetopstelling:  function(req, res) {
		var query = 'SELECT * FROM meetopstelling ORDER BY meetopstelling_id ASC';
		var db = req.app.get('dbConnection');

		db.query(query, function (err, rows, fields){
			var results = [];
			if(err){
				res.json({ status:2, melding:'de query is onjuist '});
				return;
			}
			
			rows.forEach(function(item){
				results.push({
					meetopstelling_id: item.meetopstelling_id,
					longitude: item.long, 
					latitude: item.lat,
					beschrijving: item.beschrijving
				});
			});
		

			res.json({status:1, data : results});
		});
	},
	
	exportMeetwaarden:  function(req, res) {
		var query;
		var meetopstelling_id = parseInt(req.params.meetopstelling);
		var db = req.app.get('dbConnection');
		var meetopstelling;
		
		if(isNaN(meetopstelling_id))
		{
			res.json({ status:4, melding:'meetopstelling_id is geen geldig getal'});
		}
		
		query = 'SELECT * FROM meetopstelling WHERE meetopstelling_id = ' + meetopstelling_id;
		db.query(query, function (err, rows, fields){
			var results = [];
			if(err){
				res.json({ status:2, melding:'de query is onjuist '});
				return;
			}
			
			if(rows.length != 1)
			{
				res.json({status:3, message:'Meetopstelling '+ meetopstelling_id +' bestaat niet'});
				return;
			}
			
			meetopstelling = rows[0];
		});
		
		query = 'SELECT * FROM meetwaarden WHERE meetopstelling_id = ' + meetopstelling_id + ' ORDER BY timestamp DESC';
		db.query(query, function (err, rows, fields){	
			var results = [];
			if(err){
				res.json({ status:2, melding:'de query is onjuist '});
				return;
			}
			
			rows.forEach(function(item){
				results.push({
					temp: item.temp, 
					timestamp: item.timestamp
				});
			});

			res.json({status:1, meetopstelling_id:meetopstelling.meetopstelling_id, longitude:meetopstelling.long, latitude:meetopstelling.lat, beschrijving:meetopstelling.beschrijving, data : results});
		});
	},
	
	insertMeetopstelling:  function(req, res) {
		var db = req.app.get('dbConnection');
		var longitude = req.body.longitude || "t";
		var latitude = req.body.latitude || "t";
		var beschrijving = db.escape(req.body.beschrijving) || "";
		
		if(isNaN(longitude))
		{
			res.json({status:2, message:'Er is geen longitude'});
			return;
		}
		if(isNaN(latitude))
		{
			res.json({status:3, message:'Er is geen latitude'});
			return;
		}
		
		var query = 'INSERT INTO meetopstelling (`long`, lat, beschrijving) VALUES('+ longitude +', '+ latitude + ', ' + beschrijving + ')';		
		db.query(query, function (err, rows, fields){
			if(err){
				res.json({status:5, message: 'de query kon niet uitgevoert worden'});
				return
			}
			
			res.json({status:1, message: 'OK!'});
		});
	},
	
	insertMeeting:  function(req, res) {
		var query;
		var db = req.app.get('dbConnection');
		var meetopstelling_id = parseInt(req.body.meetopstelling) || "t";
		var timestamp = parseFloat(req.body.timestamp) || "t";
		var temp = parseFloat(req.body.temp) || "t";
		
		if(isNaN(meetopstelling_id))
		{
			res.json({status:2, message:'Er is geen meetopstelling'});
			return;
		}
		
		if(isNaN(timestamp))
		{
			res.json({status:3, message:'Er is geen timestamp'});
			return;
		}
				
		if(isNaN(temp))
		{
			res.json({status:4, message:'Er is geen temperatuur'});
			return;
		}
		
		query = 'SELECT * FROM meetopstelling WHERE meetopstelling_id = ' + meetopstelling_id;
		db.query(query, function (err, rows, fields){
			var results = [];
			if(err){
				res.json({ status:5, melding:'de query is onjuist '});
				return;
			}
			
			if(rows.length != 1)
			{
				res.json({status:6, message:'Meetopstelling '+ meetopstelling_id +' bestaat niet'});
				return;
			}
		});
		
		query = 'INSERT INTO meetwaarden (timestamp, temp, meetopstelling_id) VALUES('+ timestamp +', '+ temp + ', ' + meetopstelling_id + ')';
		db.query(query, function (err, rows, fields){
			if(err){
				res.json({ message: 'de query kon niet uitgevoert worden'});
				return;
			}
			res.json({status:1, message: 'OK!'});
		});
	}*/
};

module.exports = info;
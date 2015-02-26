var express = require('express');
var router = express.Router();

var info = require('./info.js');

router.get('/hi', info.hi);
//router.get('/export', info.exportMeetopstelling);
//router.get('/exportMeetwaarden/:meetopstelling', info.exportMeetwaarden);

//router.post('/insertMeetopstelling', info.insertMeetopstelling);
//router.post('/insertMeeting', info.insertMeeting);

module.exports = router;

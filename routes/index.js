var express = require('express');
var router = express.Router();

//var auth = require('./auth.js');
var info = require('./info.js');

router.get('/tileset', info.tileset);
router.get('/tileset/:id', info.tilesetId);

module.exports = router;

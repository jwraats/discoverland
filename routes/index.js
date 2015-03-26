var express = require('express');
var router = express.Router();

//var auth = require('./auth.js');
var info = require('./info.js');

router.get('/tileset', info.tileset);
router.get('/tileset/:id', info.tilesetId);
router.post('/tileset', info.insertTileset);
router.put('/tileset/:id', info.updateTileset);
router.delete('/tileset/:id', info.deleteTileset);


router.get('/map', info.map);
router.get('/map/:id', info.mapId);
router.post('/map', info.insertMap);
router.put('/map/:id', info.updateMap);
router.delete('/map/:id', info.deleteMap);

module.exports = router;

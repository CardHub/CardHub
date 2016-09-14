var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('../config/config');
var models  = require('../models');
var AuthCtrl = require('../controllers/AuthenticateController');
var DeckCtrl = require('../controllers/DeckController');
var TagCtrl = require('../controllers/TagController');

// Set up token authenticate
var verifyToken = jwt({secret: config.secret});

router.get('/', function(req, res) {
  res.json({
    status: 'ok'
  });
});

// Authenticate with Facebook access token
router.post('/authenticate', AuthCtrl.authenticate);
// Verify JSWT
router.get('/me', verifyToken, function(req, res) {
  res.send(req.user);
});

router.get('/deck', verifyToken, DeckCtrl.index);
router.post('/deck', verifyToken, DeckCtrl.create);
router.get('/deck/:id', verifyToken, DeckCtrl.show);
router.put('/deck/:id', verifyToken, DeckCtrl.update);
router.delete('/deck/:id', verifyToken, DeckCtrl.destroy);

router.get('/tag', verifyToken, TagCtrl.index);
router.post('/tag', verifyToken, TagCtrl.create);
router.get('/tag/:id', verifyToken, TagCtrl.show);
router.put('/tag/:id', verifyToken, TagCtrl.update);
router.delete('/tag/:id', verifyToken, TagCtrl.destroy);

module.exports = router;

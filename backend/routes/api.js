var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('../config/config');
var models  = require('../models');
var AuthCtrl = require('../controllers/AuthenticateController');
// var DeckCtrl = require('../controllers/DeckController');

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

// router.get('/deck', verifyToken, DeckCtrl.index);
// router.post('/deck', verifyToken, DeckCtrl.create);
// router.get('/deck/:id', DeckCtrl.show);
// router.put('/deck/:id', verifyToken, DeckCtrl.update);
// router.delete('/deck/:id', verifyToken, DeckCtrl.destroy);


module.exports = router;

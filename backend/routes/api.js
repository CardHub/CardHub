var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('../config/config');
var AuthCtrl = require('../controllers/AuthenticateController');

// Set up token authenticate
var verifyToken = jwt({secret: config.secret});

router.get('/', function(req, res) {
  res.send('ok');
});

// Authenticate with Facebook access token
router.post('/authenticate', AuthCtrl.authenticate);
// Verify JSWT
router.get('/secret', verifyToken, function(req, res) {
  res.send(req.user);
});

module.exports = router;

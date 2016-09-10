var express = require('express');
var router = express.Router();
var AuthCtrl = require('../controllers/AuthenticateController');

router.get('/', function(req, res) {
  res.send('ok');
});

router.post('/authenticate', AuthCtrl.authenticate);

module.exports = router;

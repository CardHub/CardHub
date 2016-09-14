var jwt = require('jsonwebtoken');
var config = require('../config/config');
var models = require('../models');
var User = models.User;

// Show a specific tag
exports.show = function(req, res) {
  User.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'name', 'facebookId', 'avatar']
  }).then(function(user) {
    res.json(user);
  }).catch(function(err) {
    resError(res, err);
  });
};

function resError(res, err) {
  return res.status(500).json({
    message: err.message
  });
}

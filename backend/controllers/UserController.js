var jwt = require('jsonwebtoken');
var config = require('../config/config');
var models = require('../models');
var User = models.User;
var Deck = models.Deck;
var Card = models.Card;

// Show a specific user
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

exports.getPublicDeck = function(req, res) {
  User.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'name', 'facebookId', 'avatar'],
    include: [{
      attributes: ['id', 'name', 'color', 'isForked', 'forkedFrom', 'UserId'],
      model: Deck,
      where: {
        'isPublic': true
      }
    }]
  }).then(function(data) {
    if (data) {
      res.json(data);
    } else {
      res.json({});
    }
  }).catch(function(err) {
    resError(res, err);
  });
};

function resError(res, err) {
  return res.status(500).json({
    message: err.message
  });
}

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
  var foundUser = null;
  User.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'name', 'facebookId', 'avatar']
  }).then(function(user) {
    if (!user) {
      res.json({});
      return;
    } else {
      foundUser = user;
      return Deck.findAll({
        order: [
          ['updatedAt', 'DESC']
        ],
        attributes: ['id', 'name', 'color', 'isForked', 'forkedFrom', 'UserId'],
        where: {
          UserId: user.id,
          isPublic: true,
          isDeleted: false
        }
      })
    }
  }).
  then(function(decks) {
    if (!decks) {
      decks = [];
    }
    var result = foundUser.toJSON();
    result.Decks = decks;
    res.json(foundUser);
  }).catch(function(err) {
    resError(res, err);
  });
};

function resError(res, err) {
  return res.status(500).json({
    message: err.message
  });
}

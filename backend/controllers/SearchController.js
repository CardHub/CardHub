var sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var models = require('../models');
var User = models.User;
var Deck = models.Deck;
var Tag = models.Tag;

exports.search = function(req, res) {
  var query = req.query.q;
  if (!query) {
    return res.json({});
  }
  var page = req.query.page || 1;
  var offset = (page - 1) * 10;

  Deck.findAll({
    attributes: ['id', 'name', 'color', 'isForked', 'forkedFrom', 'UserId',
      [sequelize.literal('(SELECT COUNT(*) FROM Decks WHERE Decks.forkedFrom = Deck.id)'), 'ForkCount']
    ],
    where: {
      name: {
        $like: '%' + query + '%'
      },
      isPublic: true,
      isDeleted: false
    },
    include: [{
      attributes: ['id', 'name', 'facebookId'],
      model: User
    }],
    limit: 10,
    offset: offset,
    order: [[sequelize.literal('ForkCount'), 'DESC']]
  }).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    });
  });
};

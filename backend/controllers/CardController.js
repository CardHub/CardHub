var jwt = require('jsonwebtoken');
var config = require('../config/config');
var models = require('../models');
var User = models.User;
var Deck = models.Deck;
var Tag = models.Tag;
var Card = models.Card;

// Get all cards of the seleced deck.
exports.index = function(req, res) {
  var deckId = req.params.id;
  Deck.findOne({
    where: {
      id: deckId
    },
    attributes: ['id', 'name', 'isPublic', 'isDeleted', 'UserId'],
    include: [{
      attributes: ['id', 'name'],
      model: Tag,
      as: 'Tags',
      through: {
        attributes: []
      }
    }, {
      attributes: ['id', 'front', 'back'],
      model: Card
    }, {
      attributes: ['id', 'name', 'facebookId'],
      model: User
    }]
  }).then(function(deck) {
    if (!deck) {
      return res.json({});
    }

    // Don't show others deleted decks.
    if (deck.isDeleted && deck.UserId !== req.user.id) {
      return res.json({});
    }

    if (deck.isPublic && deck.UserId !== req.user.id) {
      var result = deck.toJSON();
      delete result.Tags; // Remove tags from non-current user deck.
      return res.json(result);
    }

    if (!deck.isPublic && deck.UserId !== req.user.id) {
      return res.json({});
    }

    res.json(deck);
  }).catch(function(err) {
    res.status(500).json({
      message: err.message
    });
  });
};

// Create a new card for selected deck.
exports.create = function(req, res) {
  var deckId = req.params.id;
  Deck.findOne({
    where: {
      id: deckId,
      UserId: req.user.id
    }
  }).then(function(deck) {
    if (!deck) {
      res.json({});
    } else {
      Card.create({
        front: req.body.front,
        back: req.body.back,
        DeckId: deckId
      }).then(function(card) {
        res.json(card);
      });
    }
  })
    .catch(function(err) {
      resError(res, err);
    });
};

// Show a specific card
exports.show = function(req, res) {
  var deckId = req.params.id;
  Deck.findOne({
    where: {
      id: deckId
    }
  }).then(function(deck) {
    if (!deck) {
      return res.json({});
    }
    // Don't show others deleted decks.
    if (deck.isDeleted && deck.UserId !== req.user.id) {
      return res.json({});
    }

    if (!deck.isPublic && deck.UserId !== req.user.id) {
      return res.json({});
    }

    Card.findOne({
      where: {
        id: req.params.cardId,
        DeckId: deckId
      }
    }).then(function(card) {
      if (!card) {
        res.json({});
      } else {
        res.json(card);
      }
    });

  })
    .catch(function(err) {
      res.status(500).json({
        message: err.message
      });
    });
};


exports.update = function(req, res) {
  var deckId = req.params.id;
  Deck.findOne({
    where: {
      id: deckId,
      UserId: req.user.id
    }
  }).then(function(deck) {
    if (!deck) {
      res.json({});
    } else {
      Card.findOne({
        where: {
          id: req.params.cardId,
          DeckId: deckId
        }
      }).then(function(card) {
        if (!card) {
          return res.json({});
        }
        card.update(req.body).then(function(result) {
          res.json(result);
        });
      });
    }
  })
    .catch(function(err) {
      res.status(500).json({
        message: err.message
      });
    });
};

exports.destroy = function(req, res) {
  var deckId = req.params.id;
  Deck.findOne({
    where: {
      id: deckId,
      UserId: req.user.id
    }
  }).then(function(deck) {
    if (!deck) {
      res.json({});
    } else {
      Card.destroy({
        where: {
          id: req.params.cardId,
          DeckId: deckId
        }
      }).then(function(result) {
        res.json(result);
      });
    }
  })
    .catch(function(err) {
      res.status(500).json({
        message: err.message
      });
    });
};

function resError(res, err) {
  return res.status(500).json({
    message: err.message
  });
}

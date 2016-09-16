var jwt = require('jsonwebtoken');
var config = require('../config/config');
var models = require('../models');
var User = models.User;
var Deck = models.Deck;
var Tag = models.Tag;
var Card = models.Card;

// Get all decks of the current user.
exports.index = function(req, res) {
  Deck.findAll({
    order: [
      ['updatedAt', 'DESC']
    ],
    attributes: ['id', 'name', 'color', 'isForked', 'forkedFrom', 'isPublic', 'isDeleted', 'UserId'],
    where: {
      UserId: req.user.id
    },
    include: [{
      attributes: ['id', 'name'],
      model: Tag,
      as: 'Tags',
      through: {
        attributes: []
      }
    }]
  }).then(function(decks) {
    res.json(decks);
  }).catch(function(err) {
    res.status(500).json({
      message: err.message
    });
  });
};

// Create a new deck for the current user.
exports.create = function(req, res) {
  if (!verifyDeckData(req.body)) {
    return res.status(400).json({
      message: 'Invalid deck data.'
    });
  }
  var deckData = getDeckDataFromRequest(req);
  Deck.create({
    name: deckData.name,
    isPublic: deckData.isPublic,
    isDeleted: deckData.isDeleted,
    color: deckData.color,
    UserId: req.user.id
  }).then(function(deck) {
    var count = deckData.tags.length;
    // Return the result if no tag specified
    if (count === 0) {
      res.json(deck);
    } else {
      deckData.tags.forEach(function(tag) {
        Tag.findOne({
          where: {
            UserId: req.user.id,
            name: tag.name
          }
        })
        .then(function(newTag) {
          deck.addTag(newTag);
          count--;
          // Return the result when all finished.
          if (count === 0) {
            res.json(deck);
          }
        });
      });
    }
  }).catch(function(err) {
    res.status(500).json({
      message: err.message
    });
  });
};

// Show a specific deck
exports.show = function(req, res) {
  // 1. First try match the deck, if found:
  //    a. If it's private, check the request user and see if he ownes the deck.
  //    b. If it's public, just return the deck.
  // 2. No match, response with empty result.
  Deck.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'name', 'isPublic', 'color', 'isForked', 'forkedFrom', 'isDeleted', 'UserId'],
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


exports.update = function(req, res) {
  Deck.findOne(
    {
      where: {
        id: req.params.id,
        UserId: req.user.id
      },
      attributes: ['id', 'name', 'isPublic', 'color', 'isDeleted', 'UserId'],
      include: [{
        attributes: ['id', 'name'],
        model: Tag,
        as: 'Tags',
        through: {
          attributes: []
        }
      }]
    })
    .then(function(result) {
      if (!result) {
        res.json({});
      } else {
        var promise = new Promise(function(resolve, reject) {
          if (req.body.Tags) {
            // Find Tags
            Tag.findAll({
              where: {
                UserId: req.user.id,
                id: {
                  $in: req.body.Tags
                }
              }
            }).then(function(foundTags) {
              if (foundTags.length !== 0) {
                result.setTags(foundTags);
              }
              delete req.body.Tags;
              resolve(result);
            }).catch(function(err) {
              reject(err);
            });
          } else {
            resolve(result);
          }
        });
        return promise;
      }
    })
    .then(function(result) {
      return result.update(
        req.body
      );
    })
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      resError(res, err);
    });
};

exports.destroy = function(req, res) {
  Deck.destroy({
    where: {
      id: req.params.id,
      UserId: req.user.id
    }
  })
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      resError(res, err);
    });
};

exports.fork = function(req, res) {
  Deck.findOne({
    where: {
      id: req.params.id,
      isPublic: true,
      isDeleted: false,
      UserId: {
        $ne: req.user.id
      }
    }
  }).then(function(deck) {
    if (!deck) {
      res.json({
        success: false,
        message: 'Error forking the deck.'
      });
    } else {
      deck.fork().then(data => {
        Deck.create({
          name: data.deck.name,
          isPublic: true,
          isDeleted: false,
          color: data.deck.color,
          isForked:true,
          forkedFrom: data.deck.UserId,
          UserId: req.user.id
        })
        .then(function(newDeck) {
          var addCards = [];

          data.cards.forEach(function(card) {
            addCards.push(
              Card.create({
                front: card.front,
                back: card.back,
                DeckId: newDeck.id
              })
            );
          });
          Promise.all(addCards).then(function() {
            res.json(newDeck);
          }, function(err) {
            resError(res, err);
          });
        });
      });
    }
  });
};

function resError(res, err) {
  return res.status(500).json({
    message: err.message
  });
}

function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

function verifyToken(token) {
  try {
    var decoded = jwt.verify(token, config.secret);
    return decoded;
  } catch (err) {
    return null;
  }
}

// A simple verify function to validate data.
function verifyDeckData(data) {
  if (!('name' in data) || !('tags' in data) || !('isPublic' in data) || !('color' in data) ) {
    return false;
  }

  return true;
}

function getDeckDataFromRequest(req) {
  var payload = req.body;
  var deckName = payload.name;
  // Remove duplicate tags
  var tagSet = new Set();
  payload.tags.forEach(function(item) {
    tagSet.add(item);
  });
  var deckTags = [];
  tagSet.forEach(function(item) {
    deckTags.push({
      name: item
    });
  });
  var isDeleted = payload.isDeleted || false;
  var deckVisibility = payload.isPublic || false;
  var color = payload.color || "#91A7D0";
  var deckData = {
    name: deckName,
    tags: deckTags,
    isDeleted: isDeleted,
    color: color,
    isPublic: deckVisibility
  };
  return deckData;
}

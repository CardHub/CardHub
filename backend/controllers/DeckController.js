var jwt = require('jsonwebtoken');
var config = require('../config/config');
var models = require('../models');
var User = models.User;
var Deck = models.Deck;
var Tag = models.Tag;

// Get all decks of the current user.
exports.index = function(req, res) {
  Deck.findAll({
    order: [
      ['updatedAt', 'DESC']
    ],
    attributes: ['id', 'name', 'isPublic', 'isDeleted', 'UserId'],
    where: {
      UserId: req.user.id
    },
    include: [{
        attributes: ['id', 'name'],
        model: Tag,
        as: 'Tags',
        through: {attributes: []}
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
    UserId: req.user.id
  }).then(function(deck) {
    var count = deckData.tags.length;
    deckData.tags.forEach(function(tag) {
      Tag.findOrCreate({where: {UserId: req.user.id, name: tag.name}})
      .spread(function(newTag, created) {
        deck.addTag(newTag);
        count--;
        // Return the result when all finished.
        if (count === 0) {
          res.json(deck);
        }
      });
    });
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
    attributes: ['id', 'name', 'isPublic', 'isDeleted', 'UserId'],
    include: [{
        attributes: ['id', 'name'],
        model: Tag,
        as: 'Tags',
        through: {attributes: []}
    }]
  }).then(function(deck) {
    if (!deck) {
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
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({
      message: "Invalid deck id."
    });
    return;
  }

  // Make sure the user owns the document before update it.
  var query = Deck.findById(req.params.id).exec();
  query.then(function(deck) {
    if (!deck || !deck.owner.equals(req.user._id)) {
      return res.status(401).json({
        message: 'No permission for the operation.'
      });
    }
    // Verify the deck is valid.
    if (!verifyDeckData(req.body)) {
      return res.status(400).json({
        message: 'Invalid deck data.'
      });
    }
    var deckData = getDeckDataFromRequest(req);
    deckData.updated_at = Date.now();
    // Update the deck.
    var query = Deck.findByIdAndUpdate(req.params.id, deckData, {'new': true}).exec();
    query.then(function(deck) {
      return res.json(deck);
    });
  }).fail(function(err) {
    res.status(500).json({
      message: err.message
    });
  });
};

exports.destroy = function(req, res) {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({
      message: "Invalid deck id."
    });
    return;
  }
  var query = Deck.findById(req.params.id).exec();
  query.then(function(deck) {
    Deck.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
        return res.status(500).json({
          message: error.message
        });
      }
      res.status(200).end();
    });
  }).fail(function(err) {
    res.status(500).json({
      message: err.message
    });
  });
};

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
  if (!('name' in data) || !('tags' in data) || !('isPublic' in data)) {
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
  var deckData = {
    name: deckName,
    tags: deckTags,
    isDeleted: isDeleted,
    isPublic: deckVisibility
  };
  return deckData;
}

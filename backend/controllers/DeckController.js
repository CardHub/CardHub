var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectId;
var config = require('../config/config');
var Deck = require('../models/Deck');

// Get all decks of the current user.
exports.index = function(req, res) {
  var user = req.user;
  var query = Deck.find({
    owner: user._id
  }).sort({
    updated_at: -1
  }).exec();

  query.then(function(decks) {
    res.send(decks);
  }).fail(function(err) {
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
  var newDeck = new Deck(deckData);
  var promise = newDeck.save();
  promise.then(function(deck) {
    return res.json(deck);
  }).fail(function(error) {
    return res.status(500).json({
      message: error.message
    });
  });
};

// Show a specific deck
exports.show = function(req, res) {
  // 1. First try match the deck, if found:
  //    a. If it's private, check the request user and see if he ownes the deck.
  //    b. If it's public, just return the deck.
  // 2. No match, response with empty result.
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({
      message: "Invalid deck id."
    });
    return;
  }

  var query = Deck.findById(req.params.id).exec();
  query.then(function(deck) {
    if (!deck) {
      return res.json({});
    }

    if (deck.public) {
      return res.json(deck);
    }

    var userToken = getToken(req);
    if (!userToken) {
      return res.json({});
    }

    var result = verifyToken(userToken);
    if (!result || !deck.owner.equals(result._id)) {
      // Access without logging in, or the user does not own this deck,
      // treat it as not found.
      return res.json({});
    }

    res.send(deck);
  }).fail(function(err) {
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
  if (!('name' in data) || !('tags' in data) || !('cards' in data) || !('public' in data)) {
    return false;
  }
  // Check tags
  var tags = data.tags;
  if (!tags.every(item => 'name' in item)) {
    return false;
  }
  // Check cards
  var cards = data.cards;
  if (!cards.every(item => 'front' in item && 'back' in item)) {
    return false;
  }

  return true;
}

function getDeckDataFromRequest(req) {
  var deckName = req.body.name;
  // Remove duplicate tags
  var tagSet = new Set();
  req.body.tags.forEach(function(item) {
    tagSet.add(item.name);
  });
  var deckTags = [];
  tagSet.forEach(function(item) {
    deckTags.push({
      name: item
    });
  });
  var deckCards = req.body.cards.map(function(item) {
    return {
      front: item.front,
      back: item.back
    };
  });
  var deckVisibility = req.body.public;
  var deckData = {
    name: deckName,
    tags: deckTags,
    owner: req.user._id,
    cards: deckCards,
    public: deckVisibility
  };
  return deckData;
}

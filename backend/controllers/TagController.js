var jwt = require('jsonwebtoken');
var config = require('../config/config');
var models = require('../models');
var User = models.User;
var Deck = models.Deck;
var Tag = models.Tag;

// Get all tags of the current user.
exports.index = function(req, res) {
  Tag.findAll({
    where: {
      UserId: req.user.id
    },
    attributes: ['id', 'name'],
  }).then(function(tags) {
    res.json(tags);
  }).catch(function(err) {
    resError(res, err);
  });
};

// Create a new tag for the current user.
exports.create = function(req, res) {
  Tag.findOne({
    where: {
      name: req.body.name,
      UserId: req.user.id
    }
  }).then(function(result) {
    if (result) {
      res.status(400).json({
        message: "Cannot add duplicate tag"
      });
      return null;
    }
    return Tag.create({
      name: req.body.name,
      UserId: req.user.id
    });
  }).then(function(tags) {
    res.status(201).json(tags);
  }).catch(function(err) {
    resError(res, err);
  });
};

// Show a specific tag
exports.show = function(req, res) {
  Tag.findOne({
    where: {
      id: req.params.id,
      UserId: req.user.id
    }
  }).then(function(tag) {
    if (!tag) {
      res.json({});
      return;
    }
    res.json(tag);
  }).catch(function(err) {
    resError(res, err);
  });
};


exports.update = function(req, res) {
  Tag.findOne({
    where: {
      name: req.body.name,
      UserId: req.user.id
    }
  }).then(function(result) {
    if (result) {
      res.json([0]); // cannot add duplicate tag
      return;
    }
    return Tag.update({
      name: req.body.name
    }, {
      where: {
        id: req.params.id,
        UserId: req.user.id
      },
      attributes: ['id', 'name'],
    });
  }).then(function(tags) {
    res.json(tags);
  }).catch(function(err) {
    resError(res, err);
  });
};

exports.destroy = function(req, res) {
  Tag.destroy({
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

function resError(res, err) {
  return res.status(500).json({
    message: err.message
  });
}

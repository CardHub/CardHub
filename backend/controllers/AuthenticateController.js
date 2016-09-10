var graph = require('fbgraph');

var User = require('../models/User');

exports.authenticate = function(req, res) {
  if (!req.body.token) {
    return res.status(400).json({
      message: 'Invalid authenticate data.'
    });
  }
  var facebookToken = req.body.token;
  graph.get("/me?fields=name,id,email&access_token=" + facebookToken, function(error, response) {
    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    // If user exists, login.
    // Else, create a login as new user.
    User.findOne({
      'facebookId': response.id
    }, function(err, user) {
      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      if (user) {
        // Sign user token
        console.log('user found');
        return res.json(user.generateJwt());
      } else {
        var newUser = new User({
          name: response.name,
          email: response.email,
          facebookId: response.id
        });

        var promise = newUser.save();
        promise.then(function(user) {
          return res.json(user.generateJwt());
        });
        promise.fail(function(error) {
          return res.status(500).json({
            message: error.message
          });
        });
      }
    });
  });
};

'use strict';
var jwt = require('jsonwebtoken');
var config = require('../config/config');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
    instanceMethods: {
      generateJwt: function() {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        return jwt.sign({
          id: this.id,
          email: this.email,
          name: this.name,
          fbId: this.facebookId,
          avatar: this.avatar,
          exp: parseInt(expiry.getTime() / 1000),
        }, config.secret);
      }
    }
  });

  User.beforeCreate(function(user, options) {
    user.avatar = 'https://graph.facebook.com/' + user.facebookId + '/picture?type=large';
  });

  return User;
};

// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  facebookId: String,
  facebookToken: String,
  created_at: Date,
  updated_at: Date
});

UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    fbId: this.facebookId,
    exp: parseInt(expiry.getTime() / 1000),
  }, config.secret);
};

UserSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);

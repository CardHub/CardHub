var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeckSchema = new Schema({
  name: String,
  tags: [{
    name: String
  }],
  owner: mongoose.Schema.Types.ObjectId,
  cards: [{
    front: String,
    back: String
  }],
  public: Boolean,
  created_at: Date,
  updated_at: Date
});

DeckSchema.pre('save', function(next) {
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
module.exports = mongoose.model('Deck', DeckSchema);

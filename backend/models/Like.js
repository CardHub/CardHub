var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LikeSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  deck: {type: mongoose.Schema.Types.ObjectId, ref: 'Deck'},
  created_at: Date
});

LikeSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Like', LikeSchema);

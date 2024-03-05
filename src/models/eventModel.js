const crypto = require('crypto');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  token_hash: {
    type: String,
    unique: true,
    required: [true, 'Token Hash missing!']
  },
  owner: { type: String, required: [true, 'Owner wallet missing'] },
  ingredientID: {
    type: Number,
    required: [true, 'Quantity missing!']
  },
});

eventSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

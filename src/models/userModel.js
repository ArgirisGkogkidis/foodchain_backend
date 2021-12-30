const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  wallet: { type: String, unique: true, required: [true, 'Please add public wallet hash'] },
  firstName: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  lastName: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

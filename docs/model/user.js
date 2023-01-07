const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    index: { unique: true }
  },
  avatar: String,
  password: String,
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  text:{
    type: String,
    maxLength:[140, 'tweets are 140 characters']
  },
  // eslint-disable-next-line camelcase
  created_at : {
    type: Number,

  }
});

module.exports = mongoose.model('Tweet', TweetSchema);
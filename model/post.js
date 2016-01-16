var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
  title: {
    type: String
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('post', postSchema)

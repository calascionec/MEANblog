var mongoose = require('mongoose');
var projectSchema = new mongoose.Schema({
  title: {
    type: String
  },
  text: {
    type: String
  },
  link: {
    type: String
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('project', postSchema);

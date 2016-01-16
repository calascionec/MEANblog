var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser') // parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

router.route('/')
  .get(function(req, res, next) {
    mongoose.model('post').find({}, function(err, posts) {
      if(err) {
        return console.error(err);
      } else {
        res.json(posts);
      }
    });
  })
  //add a new post
  .post(function(req, res) {
    var title = req.body.title;
    var text = req.body.text;

    //add to database
    mongoose.model('post').create({
      title: title,
      text: text
    }, function(err, post) {
      if(err) {
        res.send("There was a problem adding the post");
      } else {
        res.json(blob);
      }
    })
  })

  module.exports = router;

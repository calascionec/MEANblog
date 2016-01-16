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
  // route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('post').findById(id, function (err, post) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});
//return a single post

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('post').findById(req.id, function (err, post) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + post._id);
        res.json(post);
        }
      })
    });

module.exports = router;

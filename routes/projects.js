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
    mongoose.model('project').find({}, function(err, projects) {
      if(err) {
        return console.error(err);
      } else {
        res.json(projects);
      }
    });
  })
  //add a new project
  .post(function(req, res) {
    var title = req.body.title;
    var text = req.body.text;
    var link = req.body.link;
    var image = req.body.image;

    //add to database
    mongoose.model('project').create({
      title: title,
      text: text,
      link: link,
      image: image
    }, function(err, project) {
      if(err) {
        res.send("There was a problem adding the project");
      } else {
        res.json(project);
      }
    })
  })
  // route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('project').findById(id, function (err, project) {
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
            //console.log(project);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});
//return a single project

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('project').findById(req.id, function (err, project) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + project._id);
        res.json(project);
        }
      })
    });

router.put('/:id/edit', function(req, res) {
  var title = req.body.title;
  var text = req.body.text;
  var link = req.body.link;
  var image = req.body.image;

  //find the project by id
  mongoose.model('project').findById(req.id, function(err, project) {
    //update the project
    project.update({
      title: title,
      text: text,
      link: link,
      image: image
    }, function(err, projectID) {
      if(err) {
        res.send("There was a problem updatin the information:" + err);
      } else {
        res.json(project);
      }
    });
  })
})

//delete a project by id
router.delete('/:id/edit', function(req, res) {
  mongoose.model('project').findById(req.id, function(err, project) {
    if(err) {
      return console.error(err);
    } else {
      //remove project from database
      project.remove(function(err, project) {
        if(err) {
          return console.error(err);
        } else {
          res.json({message: 'deleted',
                    project: project});
        }
      });
    }
  });
});

module.exports = router;

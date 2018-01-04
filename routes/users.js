var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');

var User = require('../models/user');
var authenticate = require('../authenticate');
const cors = require('./cors.js');

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } );

router.get('/', cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {
  //res.send('respond with a resource');
  User.find(req.query)

  .then((users) => {
      res.statusCode = 200;
      // res.header("Access-Control-Allow-Origin", "*");
      // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.get('/:userId', cors.corsWithOptions, authenticate.verifyUser, /*authenticate.verifyAdmin, */function(req, res, next) {
  User.findById(req.params.userId)

  .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.put('/:userId', cors.corsWithOptions,/* authenticate.verifyUser, authenticate.verifyAdmin, */function(req, res, next) {
  
    User.findByIdAndUpdate(req.params.userId, {
        $set: req.body
    }, { new: true })
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err) => next(err))
    .catch((err) => next(err));

});

router.delete('/:userId', cors.corsWithOptions,/* authenticate.verifyUser, authenticate.verifyAdmin, */function(req, res, next) {
  User.findByIdAndRemove(req.params.userId)
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/signup', cors.corsWithOptions, authenticate.verifyAdmin, (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      console.log('hello!');
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      if(req.body.email_id)
        user.email_id = req.body.email_id;
      if(req.body.mobile_no)
        user.mobile_no = req.body.mobile_no;
      if(req.body.dob)
        user.dob = req.body.dob;
      if(req.body.location)
        user.location = req.body.location
      if(req.body.designation)
        user.designation = req.body.designation;
      if(req.body.department)
        user.department = req.body.department;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!',user: req.user, usertype: req.user.usertype});
});

router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});

module.exports = router;
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');

var user = require('../models/user');
var authenticate = require('../authenticate');
const cors = require('./cors.js');

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } );

router.get('/', cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {
  //res.send('respond with a resource');
  user.find(req.query)

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
  user.findById(req.params.userId)

  .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.put('/:userId', cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
  
    

    // if( req.body.password !== '' ) {
    //   User.findByIdAndUpdate(req.params.userId, {
    //     $set: req.body
    //   }, { new: true })
    //   .then((user) => {
    //     user.save((err, user) => {
    //       if (err) {
    //         res.statusCode = 500;
    //         res.setHeader('Content-Type', 'application/json');
    //         res.json({err: err});
    //         return ;
    //       }
    //       passport.authenticate('local')(req, res, () => {
    //         res.statusCode = 200;
    //         res.setHeader('Content-Type', 'application/json');
    //         res.json({success: true, status: 'Registration Successful!'});
    //       });
    //     });
    //   }, (err) => next(err))
    //   .catch((err) => next(err));
    // } else {
      user.findByIdAndUpdate(req.params.userId, {
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
  user.findByIdAndRemove(req.params.userId)
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

// router.post('/signup', cors.corsWithOptions, (req, res, next) => {
//   console.log('user', req.body);
  
//   User.register(new User({username: req.body.username}), 
//     req.body.password, (err, user) => {
//     if(err) {
//       console.log('Error!');
//       res.statusCode = 500;
//       res.setHeader('Content-Type', 'application/json');
//       res.json({err: err});
//     }
//     else {
//       if (req.body.firstname)
//         user.firstname = req.body.firstname;
//       if (req.body.lastname)
//         user.lastname = req.body.lastname;
//       if(req.body.email_id)
//         user.email_id = req.body.email_id;
//       if(req.body.mobile_no)
//         user.mobile_no = req.body.mobile_no;
//       if(req.body.dob)
//         user.dob = req.body.dob;
//       if(req.body.usertype)
//         user.usertype = req.body.usertype;
//       if(req.body.location)
//         user.location = req.body.location;
//       if(req.body.designation)
//         user.designation = req.body.designation;
//       if(req.body.department)
//         user.department = req.body.department;
//       user.save((err, user) => {
//         if (err) {
//           res.statusCode = 500;
//           res.setHeader('Content-Type', 'application/json');
//           res.json({err: err});
//           return ;
//         }
//         passport.authenticate('local')(req, res, () => {
//           res.statusCode = 200;
//           res.setHeader('Content-Type', 'application/json');
//           res.json({success: true, status: 'Registration Successful!'});
//         });
//       });
//     }
//   });
//   User.create(req.body)
//   .then((qset) => {
//       console.log('Question set Created ', qset);
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json({qset, success: true, status: 'Registration Successful!'});
//   }, (err) => next(err))
//   .catch((err) => next(err));
// });

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  let newUser = new user({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password,
    email_id: req.body.email_id,
    mobile_no: req.body.mobile_no,
    location: req.body.location,
    designation: req.body.designation,
    department: req.body.department,
    usertype: req.body.usertype,
    dob: req.body.dob
  });

  user.addUser(newUser, (err, user) => {
    if(err) {
      console.log('hello!');
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Registration Successful!'});
    }
  });
});

// router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  
//   var token = authenticate.getToken({_id: req.user._id});
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'application/json');
//   res.json({success: true, token: token, status: 'You are successfully logged in!',user: req.user, usertype: req.user.usertype});
// });

router.post('/login', cors.corsWithOptions, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('reqbody', req.body);
  console.log('password', password);
  user.findOne({username: username}, (err, user) => {
    // console.log('dbpassword', user[0].password);
    if (err) {
      return res.json({sucess: false, msg: 'User not found'});
    }
    if (!user) {
      return res.json({sucess: false, msg: 'User not found'});
    }
    if (user) {
      if ( password === user.password ) {
        console.log('user', user);
        const uSer = JSON.stringify(user);
        console.log('jsonuser', uSer);
        // const token = jwt.sign(user[0], config.secretKey, {
        //   expiresIn: "7d"  //seconds equivalent to 1 week 
        // });
        const token = authenticate.getToken({_id: user._id});
        res.json({
          success: true,
          token: token,
          user: {
            _id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            usertype: user.usertype
          }
        });
      } else {
        // res.statusCode = 403;
        // res.setHeader('Content-Type', 'application/json');
        res.json({success: false, msg: 'Wrong password!'});
      }
    }
  });
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
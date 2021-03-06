var express = require('express');
var mongoUrlUtils = require('mongo-url-utils');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');

var authenticate = require('./authenticate');
var config = require('./config');

var index = require('./routes/index');
var users = require('./routes/users');
var questionSetRouter = require('./routes/questionsSets');
var testRouter = require('./routes/tests');
var mailRouter = require('./routes/mailRouter');
var resetcodeRouter = require('./routes/resetcodeRouter');

var QuestionSets = require('./models/questionset');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Connection URL
//const url = 'mongodb://localhost:27017/feedbackSystem';
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useMongoClient: true,
    /* other options */
  });

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use(passport.initialize());

app.use('/', index);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/questionsets', questionSetRouter);
app.use('/mail', mailRouter);
app.use('/tests', testRouter);
app.use('/resetpassword', resetcodeRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

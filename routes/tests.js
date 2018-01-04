var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var mongoUrlUtils = require('mongo-url-utils');

var Tests = require('../models/test');
var authenticate = require('../authenticate');
const cors = require('./cors');

var testRouter = express.Router();

testRouter.use(bodyParser.json());

testRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {

});

module.exports = testRouter;
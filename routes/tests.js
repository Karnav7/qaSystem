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
    Tests.find(req.query)
    .populate('uId')
    .populate('qsetId')
    .then((tests) => {
        res.statusCode = 200;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Content-Type', 'application/json');
        res.json(tests);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Problems.create(req.body)
    .then((test) => {
        console.log('test submitted ', test);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(test);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /tests');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Tests.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

testRouter.route('/:testId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Tests.findById(req.params.testId)
    .populate('uId')
    .populate('qsetId')
    .then((test) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(test);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /tests/'+ req.params.testId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /tests/'+ req.params.testId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Tests.findByIdAndRemove(req.params.testId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = testRouter;
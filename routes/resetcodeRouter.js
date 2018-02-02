var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var randomstring = require('randomstring');

var ResetCode = require('../models/reset-code');
const cors = require('./cors');

var resetcodeRouter = express.Router();

resetcodeRouter.use(bodyParser.json())

resetcodeRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    ResetCode.find(req.query)
    .then((resetcode) => {
        res.statusCode = 200;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Content-Type', 'application/json');
        res.json(resetcode);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, (req, res, next) => {
    const code = randomstring.generate(7);
    req.body.code = code;
    console.log('randomstring', code);
    ResetCode.create(req.body)
    .then(resetcode => {
        console.log('Code generated ', resetcode);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resetcode);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete(cors.corsWithOptions, (req, res, next) => {
    ResetCode.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

module.exports = resetcodeRouter;
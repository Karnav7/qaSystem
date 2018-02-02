var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var config = require('../config');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: 'barscanrajkamal@gmail.com',
        pass: config.password
    },
    tls: {
        rejectUnauthorized: false
    }
});



// var Problems = require('../models/problems');
var authenticate = require('../authenticate');
const cors = require('./cors');

var mailRouter = express.Router();

mailRouter.use(bodyParser.json());

// body
mailRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.post(cors.corsWithOptions, (req, res, next) => {
    console.log('mail params', req.params);
    console.log('req', req.query);
    console.log('user', req.body[0]);
    var user = req.body;
    let HelperOptions = {
        from: 'barscanrajkamal@gmail.com',
        to: user.email_id,
        subject: req.query.subject,
        text: req.query.message
    }
    transporter.sendMail(HelperOptions, (error, info) => {
        if(error) {
            return console.log(error);
        }

        console.log("The message was sent.");
        console.log(info);
    });

    res.json(user);

});

module.exports = mailRouter;
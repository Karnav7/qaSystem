const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200', 'http://192.168.0.100:4200', 'http://192.168.0.110:4200'];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
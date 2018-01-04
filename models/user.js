var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    usertype: {
        type: String,
        default: 'Employee'
    },
    email_id: {
        type: String,
        default: ''
    },
    mobile_no: {
        type: String,
        default: ''
    },
    dob: {
        type: Date,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    designation: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: ''
    }
},
{
    timestamps: true
});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
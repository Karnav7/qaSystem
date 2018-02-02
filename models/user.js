var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
// var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: '123'
    },
    usertype: {
        type: String,
        default: ''
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
        type: String,
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
// User.plugin(passportLocalMongoose);

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = function(newUser, callback) {
    newUser.save(callback);
}

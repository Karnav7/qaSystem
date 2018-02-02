var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResetCodeSchema = new Schema({
    code: {
        type: String,
        default: ''
    }
});

var ResetCode = mongoose.model('Code', ResetCodeSchema);

module.exports = ResetCode;
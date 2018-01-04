const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var testSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    duration: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    qset_id: {
        type: Schema.Types.ObjectId,
        ref: 'QuestionSet'
    }
});

var Test = mongoose.model('Test', testSchema);
module.exports = Test;
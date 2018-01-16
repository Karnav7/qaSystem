const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var testSchema = new Schema({
    duration: {
        type: String,
        default: ''
    },
    uId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    qsetId: {
        type: Schema.Types.ObjectId,
        ref: 'QuestionSet'
    },
    marks_scored: {
        type: Number,
        default: ''
    },
    total_marks: {
        type: Number,
        default: ''
    }
},{
    timestamps: true
});

var Test = mongoose.model('Test', testSchema);
module.exports = Test;
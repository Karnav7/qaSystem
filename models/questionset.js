const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var optionSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    isAnswer: {
        type: Boolean,
        default: ''
    },
    isSelected: {
        type: Boolean,
        default: false
    }
    // qid: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Question'
    // }
});

var questionSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    marks: {
        type: Number,
        default: ''
    },
    options: [optionSchema]
});

var questionSetSchema = new Schema({
    department: {
        type: String,
        default: ''
    },
    designation: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    questions: [questionSchema]
},{
    timestamps: true
});



var QuestionSet = mongoose.model('QuestionSet', questionSetSchema);
var Question = mongoose.model('Question', questionSchema);

module.exports = QuestionSet;
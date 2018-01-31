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
    no: {
        type: Number,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    marks: {
        type: Number,
        default: ''
    },
    answered: {
        type: Boolean,
        default: false
    },
    options: [optionSchema]
});

var questionSetSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
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
    test_duration: {
        type: Number,
        default: ''
    },
    questions: [questionSchema]
},{
    timestamps: true
});



var QuestionSet = mongoose.model('QuestionSet', questionSetSchema);
var Question = mongoose.model('Question', questionSchema);

module.exports = QuestionSet;
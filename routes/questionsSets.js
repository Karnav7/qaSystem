var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var mongoUrlUtils = require('mongo-url-utils');

const QuestionSets = require('../models/questionset');
var authenticate = require('../authenticate');
const cors = require('./cors');

const questionSetRouter = express.Router();

questionSetRouter.use(bodyParser.json());

questionSetRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    QuestionSets.find(req.query)
    .then((qsets) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(qsets);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // req.body.uid = req.user._id;
    QuestionSets.create(req.body)
    .then((qset) => {
        console.log('Question set Created ', qset);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(qset);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /questionsets');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    QuestionSets.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

questionSetRouter.route('/:qsetId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(qset);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /questionsets/'+ req.params.qsetId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    QuestionSets.findByIdAndUpdate(req.params.qsetId, {
        $set: req.body
    }, { new: true })
    .then((qset) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(qset);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    QuestionSets.findByIdAndRemove(req.params.qsetId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

questionSetRouter.route('/:qsetId/questions')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(qset.questions);
        }
        else {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null) {
            //req.body.author = req.user._id;
            qset.questions.push(req.body);
            qset.save()
            .then((qset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(qset);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /questionset/'
        + req.params.qsetId + '/questions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null) {
            for (var i = (qset.questions.length -1); i >= 0; i--) {
                qset.questions.id(qset.questions[i]._id).remove();
            }
            qset.save()
            .then((qset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(qset);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

questionSetRouter.route('/:qsetId/questions/:qId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    QuestionSets.findById(req.params.qsetId)
    // .populate('uid')
    .then((qset) => {
        if (qset != null && qset.questions.id(req.params.qId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(qset.questions.id(req.params.qId));
        }
        else if (qset == null) {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Question ' + req.params.qId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /questionsets/'+ req.params.qsetId  + '/questions/' + req.params.qId);
})     
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => { 
        
        if (qset != null && qset.questions.id(req.params.qId) != null) {
            if (req.body.name) {
                qset.questions.id(req.params.qId).name = req.body.name;
            }
            if (req.body.options) {
                qset.questions.id(req.params.qId).options = req.body.options;                
            }
            if (req.body.no) {
                qset.questions.id(req.params.qId).no = req.body.no;
            }
            qset.save()
            .then((qset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(qset);                
            }, (err) => next(err));
        }
        else if (qset == null) {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Question ' + req.params.qId + ' not found');
            err.status = 404;
            return next(err);            
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null && qset.questions.id(req.params.qId) != null) {
            // if ((req.user._id).equals(dish.comments.id(req.params.commentId).author._id)) {
            //     err = new Error('Only the author is able change this comment!');
            //     err.status = 403;
            //     return next(err);
            //   }
            qset.questions.id(req.params.qId).remove();
            qset.save()
            .then((qset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(qset);                
            }, (err) => next(err));
        }
        else if (qset == null) {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Question ' + req.params.qId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

questionSetRouter.route('/:qsetId/questions/:qId/options')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null && qset.questions.id(req.params.qId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(qset.questions.id(req.params.qId).options);
        }
        else {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null && qset.questions.id(req.params.qId) != null) {
            qset.questions.id(req.params.qId).options.push(req.body);
            qset.save()
            .then((qset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(qset);
            }, (err) => next(err));
        } else if (qset == null) {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Question ' + req.params.qId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /questionsets/'+ req.params.qsetId
        + '/questions/' + req.params.qId + '/options' );
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null && qset.questions.id(req.params.qId) != null) {
            for (var i = (qset.questions.id(req.params.qId).options.length - 1); i >= 0; i--) {
                qset.questions.id(req.params.qId).options.id(qset.questions.id(req.params.qId).options[i]._id).remove();
            }
            qset.save()
            .then((qset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(qset);
            }, (err) => next(err));
        } else if (qset == null) {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Question ' + req.params.qId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

questionSetRouter.route('/:qsetId/questions/:qId/options/:oId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null && qset.questions.id(req.params.qId) != null && qset.questions.id(req.params.qId).options.id(req.params.oId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(qset.questions.id(req.params.qId).options.id(req.params.oId));
        } else if ( qset != null && qset.questions.id(req.params.qId) != null && qset.questions.id(req.params.qId).options.id(req.params.oId) == null) {
            err = new Error('Option ' + req.params.oId + ' not found');
            err.status = 404;
            return next(err);
        } else if ( qset != null && qset.questions.id(req.params.qId) == null ) {
            err = new Error('Question ' + req.params.qId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /questionsets/'+ req.params.qsetId
        + '/questions/' + req.params.qId + '/options/' + req.params.oId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null && qset.questions.id(req.params.qId) != null && qset.questions.id(req.params.qId).options.id(req.params.oId) != null) {
            if(req.body.name) {
                qset.questions.id(req.params.qId).options.id(req.params.oId).name = req.body.name;
            }
            if(req.body.isAnswer) {
                qset.questions.id(req.params.qId).options.id(req.params.oId).isAnswer = req.body.isAnswer;
            }
            if(req.body.isSelected) {
                qset.questions.id(req.params.qId).options.id(req.params.oId).isSelected = req.body.isSelected;
            }
            qset.save()
            .then((qset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(qset);
            }, (err) => next(err));
        } else if ( qset != null && qset.questions.id(req.params.qId) != null && qset.questions.id(req.params.qId).options.id(req.params.oId) == null) {
            err = new Error('Option ' + req.params.oId + ' not found');
            err.status = 404;
            return next(err);
        } else if ( qset != null && qset.questions.id(req.params.qId) == null ) {
            err = new Error('Question ' + req.params.qId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    QuestionSets.findById(req.params.qsetId)
    .then((qset) => {
        if (qset != null && qset.questions.id(req.params.qId) != null && qset.questions.id(req.params.qId).options.id(req.params.oId) != null) {
            qset.questions.id(req.params.qId).options.id(req.params.oId).remove();
            qset.save()
            .then((qset) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(qset);
            }, (err) => next(err));
        } else if ( qset != null && qset.questions.id(req.params.qId) != null && qset.questions.id(req.params.qId).options.id(req.params.oId) == null) {
            err = new Error('Option ' + req.params.oId + ' not found');
            err.status = 404;
            return next(err);
        } else if ( qset != null && qset.questions.id(req.params.qId) == null ) {
            err = new Error('Question ' + req.params.qId + ' not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Question set ' + req.params.qsetId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = questionSetRouter;
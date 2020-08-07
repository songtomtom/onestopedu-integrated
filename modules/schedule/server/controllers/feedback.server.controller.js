/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const config = require(path.resolve('./config/config'));
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Feedback = mongoose.model('Feedback');

/**
 * Create an Feedback
 */
exports.save = function(req, res, next) {
  const feedback = new Feedback();
  feedback.save((err, feedback) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.feedback = feedback;
      next();
    }
  });
};

/**
 * Many create an feedbacks
 */
exports.create = function(req, res, next) {
  const documents = req.body;
  const feedbacks = documents.map(() => {
    return new Feedback();
  });

  Feedback.create(feedbacks, (err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    req.feedbacks = feedbacks;
    next();
  });
};

/**
 * Show the current Feedback
 */
exports.read = function(req, res) {
  const feedback = req.feedback ? req.feedback.toJSON() : {};
  res.json(feedback);
};

/**
 * Update an Feedback
 */
exports.update = function(req, res) {

  const feedback = _.extend(req.feedback, req.body);
  feedback.updated = Date.now();
  feedback.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feedback);
    }
  });
};

/**
 * Delete an Feedback
 */
exports.remove = function(req, res) {
  const feedback = req.feedback;

  feedback.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(feedback);
    }
  });
};

/**
 * List of Feedbacks
 */
exports.list = function(req, res) {

  Feedback.find()
    .sort('-created')
    .exec((err, feedbacks) => {

      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(feedbacks);
      }
    });
};

/**
 * Feedback middleware
 */
exports.feedbackById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'feedback is invalid'
    });
  }

  Feedback.findById(id)
    .populate('recordFile')
    .exec((err, feedback) => {
      if (err) {
        return next(err);
      } else if (!feedback) {
        return res.status(404).send({
          message: 'No feedback with that identifier has been found'
        });
      }
      req.feedback = feedback;
      next();
    });
};

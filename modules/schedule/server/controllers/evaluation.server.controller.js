/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const config = require(path.resolve('./config/config'));
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Evaluation = mongoose.model('Evaluation');

/**
 * Create an Evaluation
 */
exports.save = function(req, res, next) {
  const evaluation = new Evaluation();
  evaluation.save((err, evaluation) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.evaluation = evaluation;
      next();
    }
  });
};

/**
 * Many create an evaluations
 */
exports.create = function(req, res, next) {
  const documents = req.body;
  const evaluations = documents.map(() => {
    return new Evaluation();
  });

  Evaluation.create(evaluations, (err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    req.evaluations = evaluations;
    next();
  });
};

/**
 * Show the current Evaluation
 */
exports.read = function(req, res) {
  const evaluation = req.evaluation ? req.evaluation.toJSON() : {};
  res.json(evaluation);
};

/**
 * Update an Evaluation
 */
exports.update = function(req, res) {

  const evaluation = _.extend(req.evaluation, req.body);
  evaluation.updated = Date.now();
  evaluation.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(evaluation);
    }
  });
};

/**
 * Delete an Evaluation
 */
exports.remove = function(req, res) {
  const evaluation = req.evaluation;

  evaluation.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(evaluation);
    }
  });
};

/**
 * List of Evaluations
 */
exports.list = function(req, res) {

  Evaluation.find()
    .sort('-created')
    .exec((err, evaluations) => {

      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(evaluations);
      }
    });
};

/**
 * Evaluation middleware
 */
exports.evaluationById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'evaluation is invalid'
    });
  }

  Evaluation.findById(id)
    .exec((err, evaluation) => {
      if (err) {
        return next(err);
      } else if (!evaluation) {
        return res.status(404).send({
          message: 'No evaluation with that identifier has been found'
        });
      }
      req.evaluation = evaluation;
      next();
    });
};

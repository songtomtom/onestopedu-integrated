/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const config = require(path.resolve('./config/config'));
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Assessment = mongoose.model('Assessment');

/**
 * Create an Assessment
 */
exports.save = function(req, res, next) {
  const assessment = new Assessment();
  assessment.save((err, assessment) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.assessment = assessment;
      next();
    }
  });
};

/**
 * Show the current Assessment
 */
exports.read = function(req, res) {
  const assessment = req.assessment ? req.assessment.toJSON() : {};
  res.json(assessment);
};

/**
 * Update an Assessment
 */
exports.update = function(req, res) {

  const assessment = _.extend(req.assessment, req.body);
  assessment.updated = Date.now();
  assessment.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(assessment);
    }
  });
};

/**
 * Delete an Assessment
 */
exports.remove = function(req, res) {
  const assessment = req.assessment;

  assessment.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(assessment);
    }
  });
};

/**
 * List of Assessments
 */
exports.list = function(req, res) {

  Assessment.find()
    .sort('-created')
    .exec((err, assessments) => {

      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(assessments);
      }
    });
};

/**
 * Assessment middleware
 */
exports.assessmentById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'assessment is invalid'
    });
  }

  Assessment.findById(id)
    .populate('recordFile')
    .exec((err, assessment) => {
      if (err) {
        return next(err);
      } else if (!assessment) {
        return res.status(404).send({
          message: 'No assessment with that identifier has been found'
        });
      }
      req.assessment = assessment;
      next();
    });
};

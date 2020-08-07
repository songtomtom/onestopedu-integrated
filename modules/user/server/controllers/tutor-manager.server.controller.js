/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const TutorManager = mongoose.model('TutorManager');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Sign up an Tutor Manager
 */
exports.signup = function(req, res) {

  const tutorManager = new TutorManager(req.body);
  tutorManager.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      /**
       * Remove sensitive data before login
       */
      tutorManager.password = undefined;
      tutorManager.salt = undefined;
      res.json(tutorManager);
    }
  });
};

/**
 * Show the current Tutor Manager
 */
exports.read = function(req, res) {
  const tutorManager = req.tutorManager ? req.tutorManager.toJSON() : {};
  res.json(req.tutorManager);
};

/**
 * Update an tutor manager
 */
exports.update = function(req, res) {

  const tutorManager = _.extend(req.tutorManager, req.body);
  tutorManager.updated = Date.now();
  tutorManager.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tutorManager);
    }
  });
};

/**
 * Delete an tutor manager
 */
exports.remove = function(req, res) {
  const tutorManager = req.tutorManager;

  tutorManager.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(tutorManager);
    }
  });
};

/**
 * List of tutor managers
 */
exports.list = function(req, res) {

  const user = req.user;

  TutorManager.find({
      roles: ['tutorManager'],
      languages: {
        $in: (Array.isArray(user.languages)) ? user.languages : Array(user.languages)
      }
    })
    .sort('-created')
    .exec((err, tutorManagers) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(tutorManagers);
      }
    });
};

/**
 * Tutor Manager middleware
 */
exports.tutorManagerById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tutor Manager is invalid'
    });
  }

  TutorManager.findById(id)
    .exec((err, tutorManager) => {
      if (err) {
        return next(err);
      } else if (!tutorManager) {
        return res.status(404).send({
          message: 'No Tutor Manager with that identifier has been found'
        });
      }
      req.tutorManager = tutorManager;
      next();
    });
};

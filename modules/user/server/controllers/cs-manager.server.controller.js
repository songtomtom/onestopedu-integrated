/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const CSManager = mongoose.model('CSManager');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Sign up an CS Manager
 */
exports.signup = function(req, res) {

  const csManager = new CSManager(req.body);
  csManager.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      /**
       * Remove sensitive data before login
       */
      csManager.password = undefined;
      csManager.salt = undefined;
      res.json(csManager);
    }
  });
};

/**
 * Show the current CS Manager
 */
exports.read = function(req, res) {
  const csManager = req.csManager ? req.csManager.toJSON() : {};
  res.json(req.csManager);
};

/**
 * Update an CS Manager
 */
exports.update = function(req, res) {

  const csManager = _.extend(req.csManager, req.body);
  csManager.updated = Date.now();
  csManager.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(csManager);
    }
  });
};

/**
 * Delete an CS Manager
 */
exports.remove = function(req, res) {
  const csManager = req.csManager;

  csManager.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(csManager);
    }
  });
};

/**
 * List of CS Managers
 */
exports.list = function(req, res) {

  const user = req.user;

  CSManager.find({
      roles: ['csManager'],
      languages: {
        $in: (Array.isArray(user.languages)) ? user.languages : Array(user.languages)
      }
    })
    .sort('-created')
    .exec((err, csManagers) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(csManagers);
      }
    });
};

/**
 * CS Manager middleware
 */
exports.csManagerById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'CS Manager is invalid'
    });
  }

  CSManager.findById(id)
    .exec((err, csManager) => {
      if (err) {
        return next(err);
      } else if (!csManager) {
        return res.status(404).send({
          message: 'No CS Manager with that identifier has been found'
        });
      }
      req.csManager = csManager;
      next();
    });
};

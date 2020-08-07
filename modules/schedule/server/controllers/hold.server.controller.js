/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const moment = require('moment');
const config = require(path.resolve('./config/config'));
const Hold = mongoose.model('Hold');

/**
 * Create an hold
 */
exports.save = function(req, res, next) {
  const hold = new Hold(req.body);
  hold.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hold);
    }
  });
};

/**
 * Show the current Hold
 */
exports.read = function(req, res) {
  const hold = req.hold ? req.hold.toJSON() : {};
  res.json(hold);
};

/**
 * Update an Hold
 */
exports.update = function(req, res) {
  const hold = _.extend(req.hold, req.body);
  hold.updated = Date.now();
  hold.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hold);
    }
  });
};

/**
 * Delete an Hold
 */
exports.remove = function(req, res) {
  const hold = req.hold;

  hold.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(hold);
    }
  });
};

/**
 * List of Lessons
 */
exports.list = function(req, res) {

  const user = req.user;

  Hold.find({
      providers: {
        $in: user.providers
      }
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'course'
    })
    .populate({
      path: 'startLesson',
      select: 'started'
    })
    .populate({
      path: 'endLesson',
      select: 'started'
    })
    .sort('-created')
    .exec((err, holds) => {
      if (err) {

        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(holds);
      }
    });
};

/**
 * Count an Hold
 */
exports.count = function(req, res) {

  const user = req.user;

  Hold.count({
    providers: {
      $in: user.providers
    },
    state: 'hold'
  }, (err, count) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({
        count
      });
    }
  });
};

/**
 * Hold middleware
 */
exports.holdById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'hold is invalid'
    });
  }

  Hold.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .exec((err, hold) => {
      if (err) {
        return next(err);
      } else if (!hold) {
        return res.status(404).send({
          message: 'No Hold with that identifier has been found'
        });
      }
      req.hold = hold;
      next();
    });
};

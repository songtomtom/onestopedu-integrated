/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const Tutor = mongoose.model('Tutor');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Sign up an tutor
 */
exports.signup = function(req, res) {

  const tutor = new Tutor(req.body);
  tutor.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      /**
       * Remove sensitive data before login
       */
      tutor.password = undefined;
      tutor.salt = undefined;
      res.json(tutor);
    }
  });
};

/**
 * Show the current tutor
 */
exports.read = function(req, res) {
  const tutor = req.tutor ? req.tutor.toJSON() : {};
  res.json(req.tutor);
};

/**
 * Update an tutor
 */
exports.update = function(req, res) {

  const tutor = _.extend(req.tutor, req.body);
  tutor.updated = Date.now();
  tutor.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tutor);
    }
  });
};

/**
 * Delete an tutor
 */
exports.remove = function(req, res) {
  const tutor = req.tutor;

  tutor.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(tutor);
    }
  });
};

/**
 * List of tutors
 */
exports.list = function(req, res) {

  const user = req.user;

  Tutor.find({
      roles: ['tutor'],
      languages: {
        $in: user.languages
      }
    })
    .sort('-created')
    .exec((err, tutors) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(tutors);
      }
    });
};

/**
 * List of tutors
 */
exports.nationByList = function(req, res) {

  const user = req.user;

  const conditions = {
    roles: ['tutor'],
    languages: {
      $in: user.languages
    },
    nation: req.body.nation
  };

  if (!conditions.nation) {
    delete conditions.nation;
  }

  Tutor.find(conditions)
    .select('-password -salt')
    .sort('-created')
    .exec((err, tutors) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(tutors);
      }
    });
};


/**
 * List of tutors
 */
exports.tutorsByList = function(req, res) {

  const user = req.user;

  Tutor.find({
      _id: {
        $in: req.body.tutorIds
      }
    })
    .select('-password -salt')
    .sort('-created')
    .exec((err, tutors) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(tutors);
      }
    });
};

/**
 * Tutor middleware
 */
exports.tutorById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'tutor is invalid'
    });
  }

  Tutor.findById(id)
    .populate('breakTimes')
    .exec((err, tutor) => {
      if (err) {
        return next(err);
      } else if (!tutor) {
        return res.status(404).send({
          message: 'No tutor with that identifier has been found'
        });
      }
      req.tutor = tutor;
      next();
    });
};

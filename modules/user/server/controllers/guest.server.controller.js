/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const Guest = mongoose.model('Guest');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Sign up an guest
 */
exports.signup = function(req, res) {

  const guest = new Guest(req.body);
  guest.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      /**
       * Remove sensitive data before login
       */
      guest.password = undefined;
      guest.salt = undefined;
      res.json(guest);
    }
  });
};

/**
 * Show the current guest
 */
exports.read = function(req, res) {
  const guest = req.guest ? req.guest.toJSON() : {};
  res.json(req.guest);
};

/**
 * Update an guest
 */
exports.update = function(req, res) {

  const guest = _.extend(req.guest, req.body);
  guest.updated = Date.now();
  guest.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(guest);
    }
  });
};

/**
 * Delete an guest
 */
exports.remove = function(req, res) {
  const guest = req.guest;

  guest.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(guest);
    }
  });
};

/**
 * List of guests
 */
exports.list = function(req, res) {

  const user = req.user;

  Guest.find({
      providers: {
        $in: user.providers
      },
      roles: ['guest']
    })
    .sort('-created')
    .exec((err, guests) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(guests);
      }
    });
};

/**
 * Guest middleware
 */
exports.guestById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'guest is invalid'
    });
  }

  Guest.findById(id)
    .exec((err, guest) => {
      if (err) {
        return next(err);
      } else if (!guest) {
        return res.status(404).send({
          message: 'No guest with that identifier has been found'
        });
      }
      req.guest = guest;
      next();
    });
};

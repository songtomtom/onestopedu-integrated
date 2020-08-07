/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Sign up an admin
 */
exports.signup = function(req, res) {

  const admin = new Admin(req.body);
  admin.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      /**
       * Remove sensitive data before login
       */
      admin.password = undefined;
      admin.salt = undefined;
      res.json(admin);
    }
  });
};

/**
 * Show the current admin
 */
exports.read = function(req, res) {
  const admin = req.admin ? req.admin.toJSON() : {};
  res.json(req.admin);
};

/**
 * Update an admin
 */
exports.update = function(req, res) {

  const admin = _.extend(req.admin, req.body);
  admin.updated = Date.now();
  admin.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(admin);
    }
  });
};

/**
 * Delete an admin
 */
exports.remove = function(req, res) {
  const admin = req.admin;

  admin.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(admin);
    }
  });
};

/**
 * List of admins
 */
exports.list = function(req, res) {

  Admin.find({
      roles: ['admin']
    })
    .sort('-created')
    .exec((err, admins) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(admins);
      }
    });
};

/**
 * Admin middleware
 */
exports.adminById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'admin is invalid'
    });
  }

  Admin.findById(id)
    .exec((err, admin) => {
      if (err) {
        return next(err);
      } else if (!admin) {
        return res.status(404).send({
          message: 'No admin with that identifier has been found'
        });
      }
      req.admin = admin;
      next();
    });
};

/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Contact1x1 = mongoose.model('Contact1x1');

/**
 * Create an Contact1x1
 */
exports.create = function(req, res) {

  const contact1x1 = new Contact1x1(req.body);
  contact1x1.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(contact1x1);
  });
};

/**
 * Show the current contact1x1
 */
exports.read = function(req, res) {
  const contact1x1 = req.contact1x1 ? req.contact1x1.toJSON() : {};
  res.json(contact1x1);
};

/**
 * Update an contact1x1
 */
exports.update = function(req, res) {

  const contact1x1 = _.extend(req.contact1x1, req.body);

  contact1x1.updated = Date.now();
  contact1x1.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contact1x1);
    }
  });
};

/**
 * Delete an contact1x1
 */
exports.remove = function(req, res) {
  const contact1x1 = req.contact1x1;

  contact1x1.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(contact1x1);
    }
  });
};

/**
 * List of contact1x1s
 */
exports.list = function(req, res) {

  const user = req.user;
  Contact1x1.find({
      providers: {
        $in: user.providers
      }
    })
    .populate({
      path: 'user',
      select: 'username profileImage'
    })
    .exec((err, contact1x1s) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(contact1x1s);
      }
    });
};


/**
 * List of Contact
 */
exports.listByMemberId = function(req, res) {

  const member = req.member;

  Contact1x1.find({
      user: member._id
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .sort('-created')
    .exec((err, payments) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(payments);
      }
    });
};

/**
 * Contact1x1 middleware
 */
exports.contact1x1ById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'contact1x1 is invalid'
    });
  }

  Contact1x1.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username nickName roles created profileImage'
      }
    })
    .exec((err, contact1x1) => {
      if (err) {
        return next(err);
      } else if (!contact1x1) {
        return res.status(404).send({
          message: 'No contact1x1 with that identifier has been found'
        });
      }
      req.contact1x1 = contact1x1;
      next();
    });
};

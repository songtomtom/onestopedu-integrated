/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const moment = require('moment');
const Refund = mongoose.model('Refund');

/**
 * Create an Refund
 */
exports.create = function(req, res) {
  const refund = new Refund(req.body);
  refund.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(refund);
    }
  });
};

/**
 * Show the current Refund
 */
exports.read = function(req, res) {
  const refund = req.refund ?
    req.refund.toJSON() : {};
  res.json(refund);
};

/**
 * Update an Refund
 */
exports.update = function(req, res) {

  const refund = _.extend(req.refund, req.body);
  refund.updated = Date.now();
  refund.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(refund);
    }
  });
};

/**
 * Delete an Refund
 */
exports.remove = function(req, res) {
  const refund = req.refund;

  refund.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(refund);
    }
  });
};

/**
 * List of Refunds
 */
exports.listByMemberId = function(req, res) {

  const member = req.member;

  Refund.find({
      user: member._id
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate('payment')
    .sort('-created')
    .exec((err, refunds) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(refunds);
      }
    });
};

/**
 * List of Refunds
 */
exports.list = function(req, res) {

  const user = req.user;

  Refund.find({
      providers: {
        $in: user.providers
      }
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate('payment')
    .sort('-created')
    .exec((err, refunds) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(refunds);
      }
    });
};

/**
 * Refund middleware
 */
exports.refundById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'refund is invalid'
    });
  }

  Refund.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate('payment')
    .exec((err, refund) => {
      if (err) {
        return next(err);
      } else if (!refund) {
        return res.status(404).send({
          message: 'No refund with that identifier has been found'
        });
      }
      req.refund = refund;
      next();
    });
};

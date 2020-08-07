/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const moment = require('moment');
const Payment = mongoose.model('Payment');

/**
 * Create an Payment
 */
exports.create = function(req, res) {
  const payment = new Payment(req.body);
  payment.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payment);
    }
  });
};

/**
 * Show the current Payment
 */
exports.read = function(req, res) {
  const payment = req.payment ? req.payment.toJSON() : {};
  res.json(payment);
};

/**
 * Update an Payment
 */
exports.update = function(req, res) {

  const payment = _.extend(req.payment, req.body);
  payment.updated = Date.now();
  if (payment.state !== 'refunded' && payment.refund) {
    payment.refund = undefined;
  }
  payment.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(payment);
    }
  });
};

/**
 * Delete an Payment
 */
exports.remove = function(req, res) {
  const payment = req.payment;

  payment.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(payment);
    }
  });
};

/**
 * List of Payments
 */
exports.listByMemberId = function(req, res) {

  const member = req.member;

  Payment.find({
      user: member._id
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'tutor',
        select: 'nickName'
      },
      options: {
        sort: {
          started: 1
        }
      }
    })
    .populate('product')
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
 * List of Payments
 */
exports.list = function(req, res) {

  const user = req.user;

  Payment.find({
      providers: {
        $in: user.providers
      }
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate('course')
    .populate('product')
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
 * Payment middleware
 */
exports.paymentById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'payment is invalid'
    });
  }

  Payment.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'user',
        select: '-password -salt'
      }
    })
    .populate('refund')
    .populate('usePoint')
    .populate('useCoupon')
    .exec((err, payment) => {
      if (err) {
        return next(err);
      } else if (!payment) {
        return res.status(404).send({
          message: 'No payment with that identifier has been found'
        });
      }
      req.payment = payment;
      next();
    });
};

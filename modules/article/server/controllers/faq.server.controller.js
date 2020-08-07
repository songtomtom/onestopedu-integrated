/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const FAQ = mongoose.model('FAQ');

/**
 * Create an FAQ
 */
exports.create = function(req, res) {
  const faq = new FAQ(req.body);
  faq.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(faq);
    }
  });
};

/**
 * Show the current FAQ
 */
exports.read = function(req, res) {
  const faq = req.faq ? req.faq.toJSON() : {};
  res.json(faq);
};

/**
 * Update an FAQ
 */
exports.update = function(req, res) {

  const faq = _.extend(req.faq, req.body);
  faq.updated = Date.now();
  faq.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(faq);
    }
  });
};

/**
 * Delete an FAQ
 */
exports.remove = function(req, res) {
  const faq = req.faq;

  faq.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(faq);
    }
  });
};

/**
 * List of FAQs
 */
exports.list = function(req, res) {

  const user = req.user;

  FAQ.find({
      providers: {
        $in: user.providers
      }
    })
    .select('-answer')
    .sort('-counters')
    .populate({
      path: 'user',
      select: 'nickName profileImage'
    })
    .exec((err, faqs) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(faqs);
      }
    });
};

/**
 * FAQ middleware
 */
exports.faqById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'FAQ is invalid'
    });
  }

  FAQ.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .exec((err, faq) => {
      if (err) {
        return next(err);
      } else if (!faq) {
        return res.status(404).send({
          message: 'No FAQ with that identifier has been found'
        });
      }
      req.faq = faq;
      next();
    });
};

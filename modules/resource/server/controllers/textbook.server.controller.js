/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Textbook = mongoose.model('Textbook');


/**
 * Create an Textbook
 */
exports.create = function(req, res) {

  const textbook = new Textbook(req.body);
  textbook.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(textbook);
    }
  });
};

/**
 * Show the current Textbook
 */
exports.read = function(req, res) {
  const textbook = req.textbook ? req.textbook.toJSON() : {};
  res.json(textbook);
};

/**
 * Update an Textbook
 */
exports.update = function(req, res) {
  const textbook = _.extend(req.textbook, req.body);
  textbook.updated = Date.now();
  textbook.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(textbook);
    }
  });
};

/**
 * Delete an Textbook
 */
exports.remove = function(req, res) {
  const textbook = req.textbook;

  textbook.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(textbook);
    }
  });
};

/**
 * List of Textbooks
 */
exports.list = function(req, res) {
  Textbook.find()
    .sort('-counters')
    .populate('textbookFile')
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .exec((err, textbooks) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(textbooks);
      }
    });
};

/**
 * Textbook middleware
 */
exports.textbookById = function textbookById(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'textbook is invalid'
    });
  }

  Textbook.findById(id)
    .populate('textbookFile')
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .exec((err, textbook) => {
      if (err) {
        return next(err);
      } else if (!textbook) {
        return res.status(404).send({
          message: 'No Textbook with that identifier has been found'
        });
      }
      req.textbook = textbook;
      next();
    });
};

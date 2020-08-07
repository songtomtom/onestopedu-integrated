/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Partnership = mongoose.model('Partnership');

/**
 * Create an Partnership
 */
exports.create = function(req, res) {

  const partnership = new Partnership(req.body);
  partnership.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(partnership);
  });
};

/**
 * Show the current partnership
 */
exports.read = function(req, res) {
  const partnership = req.partnership ? req.partnership.toJSON() : {};
  res.json(partnership);
};

/**
 * Update an partnership
 */
exports.update = function(req, res) {

  const partnership = _.extend(req.partnership, req.body);

  partnership.updated = Date.now();
  partnership.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(partnership);
    }
  });
};

/**
 * Delete an partnership
 */
exports.remove = function(req, res) {
  const partnership = req.partnership;

  partnership.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(partnership);
    }
  });
};

/**
 * List of partnerships
 */
exports.list = function(req, res) {

  const user = req.user;
  Partnership.find({
      providers: {
        $in: user.providers
      }
    })
    .sort('-created ')
    .exec((err, partnerships) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(partnerships);
      }
    });
};

/**
 * Partnership middleware
 */
exports.partnershipById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'partnership is invalid'
    });
  }

  Partnership.findById(id)
    .exec((err, partnership) => {
      if (err) {
        return next(err);
      } else if (!partnership) {
        return res.status(404).send({
          message: 'No partnership with that identifier has been found'
        });
      }
      req.partnership = partnership;
      next();
    });
};

/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Point = mongoose.model('Point');

/**
 * Create an Point resource
 */
exports.save = function(req, res, next) {
  const point = new Point(req.body);
  point.pastPoint = req.member.point;
  point.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!req.member) {
      // This is the membername that exists in this provider.
      return res.status(404).send({
        message: 'This is the member name that exists in this provider.'
      });
    } else {
      req.point = point;
      next();
    }
  });
};

/**
 * Show the current Point
 */
exports.read = function(req, res) {
  const point = req.point ? req.point.toJSON() : {};
  res.json(point);
};

/**
 * Update an Point
 */
exports.update = function(req, res) {
  const point = _.extend(req.point, req.body);
  point.updated = Date.now();
  point.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(point);
    }
  });
};

/**
 * Delete an Point
 */
exports.remove = function(req, res) {
  const point = req.point;

  point.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(point);
    }
  });
};

/**
 * List of Point resource
 */
exports.list = function(req, res) {

  const query = req.query;

  Point.find()
    .sort('-created')
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'payer',
      select: '-password -salt'
    })
    .exec((err, points) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(points);
      }
    });
};

/**
 * List of Payments
 */
exports.listByMemberId = function(req, res) {

  const member = req.member;

  Point.find({
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
 * Point resource middleware
 */
exports.pointById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Point resource is invalid'
    });
  }

  Point.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'payer',
      select: '-password -salt'
    })
    .exec((err, point) => {
      if (err) {
        return next(err);
      } else if (!point) {
        return res.status(404).send({
          message: 'No Point resource with that identifier has been found'
        });
      }
      req.point = point;
      next();
    });
};

/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const EventBanner = mongoose.model('EventBanner');

/**
 * Create an Event Banner
 */
exports.create = function(req, res) {
  const eventBanner = new EventBanner(req.body);
  eventBanner.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventBanner);
    }
  });
};

/**
 * Show the current Event Banner
 */
exports.read = function(req, res) {
  const eventBanner = req.eventBanner ? req.eventBanner.toJSON() : {};
  res.json(eventBanner);
};

/**
 * Update an Event Banner
 */
exports.update = function(req, res) {

  const eventBanner = _.extend(req.eventBanner, req.body);
  eventBanner.updated = Date.now();
  eventBanner.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(eventBanner);
    }
  });
};

/**
 * Delete an Event Banner
 */
exports.remove = function(req, res) {
  const eventBanner = req.eventBanner;

  eventBanner.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(eventBanner);
    }
  });
};

/**
 * List of Event Banners
 */
exports.list = function(req, res) {

  const user = req.user;

  EventBanner.find({
      providers: {
        $in: user.providers
      }
    })
    .sort('-counters')
    .populate({
      path: 'user',
      select: 'nickName profileImage'
    })
    .exec((err, eventBanners) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(eventBanners);
      }
    });
};

/**
 * Event Banner middleware
 */
exports.eventBannerById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'EventBanner is invalid'
    });
  }

  EventBanner.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .exec((err, eventBanner) => {
      if (err) {
        return next(err);
      } else if (!eventBanner) {
        return res.status(404).send({
          message: 'No Event Banner with that identifier has been found'
        });
      }
      req.eventBanner = eventBanner;
      next();
    });
};

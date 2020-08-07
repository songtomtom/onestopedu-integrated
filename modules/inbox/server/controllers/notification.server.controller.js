/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Notification = mongoose.model('Notification');

/**
 * Create an Notification
 */
module.exports.create = function(req, res) {

  const notification = new Notification(req.body);

  notification.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(notification);
    }
  });
};

/**
 * Show the current notification
 */
module.exports.read = function(req, res) {

  const notification = req.notification ? req.notification.toJSON() : {};
  res.json(req.notification);
};

/**
 * Update an notification
 */
module.exports.update = function(req, res) {

  const notification = _.extend(req.notification, req.body);

  notification.updated = Date.now();
  notification.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(notification);
    }
  });
};

/**
 * Delete an notification
 */
module.exports.remove = function(req, res) {
  const notification = req.notification;

  notification.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(notification);
    }
  });
};

/**
 * List of notifications
 */
module.exports.list = function(req, res) {
  Notification.find()
    .sort('-created')
    .populate({
      path: 'from',
      select: '-password -salt'
    })
    .exec((err, notifications) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(notifications);
      }
    });
};

/**
 * Notification middleware
 */
module.exports.notificationById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'notification is invalid'
    });
  }

  Notification.findById(id)
    .populate('user')
    .exec((err, notification) => {
      if (err) {
        return next(err);
      } else if (!notification) {
        return res.status(404).send({
          message: 'No notification with that identifier has been found'
        });
      }
      req.notification = notification;
      next();
    });
};

/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Notice = mongoose.model('Notice');

/**
 * Create an Notice
 */
exports.create = function(req, res) {

  const notice = new Notice(req.body);
  notice.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(notice);
  });
};

/**
 * Show the current notice
 */
exports.read = function(req, res) {
  const notice = req.notice ? req.notice.toJSON() : {};
  res.json(notice);
};

/**
 * Update an notice
 */
exports.update = function(req, res) {

  const notice = _.extend(req.notice, req.body);

  notice.updated = Date.now();
  notice.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(notice);
    }
  });
};

/**
 * Delete an notice
 */
exports.remove = function(req, res) {
  const notice = req.notice;

  notice.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(notice);
    }
  });
};

/**
 * List of notices
 */
exports.list = function(req, res) {

  const user = req.user;
  Notice.find({
      category: 'notice',
      providers: {
        $in: user.providers
      }
    })
    .sort('-noticeType -counters')
    .select('-contents -category')
    .populate({
      path: 'user',
      select: 'nickName profileImage'
    })
    .exec((err, notices) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(notices);
      }
    });
};

/**
 * Notice middleware
 */
exports.noticeById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'notice is invalid'
    });
  }

  Notice.findById(id)
    .populate('attachmentFiles')
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .exec((err, notice) => {
      if (err) {
        return next(err);
      } else if (!notice) {
        return res.status(404).send({
          message: 'No notice with that identifier has been found'
        });
      }
      req.notice = notice;
      next();
    });
};

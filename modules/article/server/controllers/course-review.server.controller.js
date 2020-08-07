/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const CourseReview = mongoose.model('CourseReview');

/**
 * Create an Product review
 */
exports.create = function(req, res) {
  const courseReview = new CourseReview(req.body);
  courseReview.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(courseReview);
    }
  });
};

/**
 * Show the current Product review
 */
exports.read = function(req, res) {
  const courseReview = req.courseReview ? req.courseReview.toJSON() : {};
  res.json(courseReview);
};

/**
 * Update an Product review
 */
exports.update = function(req, res) {
  const courseReview = _.extend(req.courseReview, req.body);
  courseReview.updated = Date.now();
  courseReview.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(courseReview);
    }
  });
};

/**
 * Delete an Product review
 */
exports.remove = function(req, res) {
  const courseReview = req.courseReview;

  courseReview.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(courseReview);
    }
  });
};

/**
 * List of Product review
 */
exports.list = function(req, res) {

  const user = req.user;

  CourseReview.find({
      category: 'courseReview',
      providers: {
        $in: user.providers
      }
    })
    .sort('-courseReviewType -counters')
    .populate({
      path: 'user',
      select: 'username koreanName englishName nickName profileImage'
    })
    .populate({
      path: 'writePoint',
      select: 'amount'
    })
    .populate({
      path: 'topPoint',
      select: 'amount'
    })
    .populate('attachmentFiles')
    .exec((err, courseReviews) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(courseReviews);
      }
    });
};

/**
 * Product review middleware
 */
exports.courseReviewById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product review is invalid'
    });
  }

  CourseReview.findById(id)
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
    .populate({
      path: 'writePoint',
      select: 'amount created'
    })
    .populate({
      path: 'topPoint',
      select: 'amount created'
    })
    .populate('attachmentFiles')
    .exec((err, courseReview) => {
      if (err) {
        return next(err);
      } else if (!courseReview) {
        return res.status(404).send({
          message: 'No product review with that identifier has been found'
        });
      }
      req.courseReview = courseReview;
      next();
    });
};

/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Comment = mongoose.model('Comment');

/**
 * Create an Comment
 */
exports.create = function(req, res) {

  const comment = new Comment(req.body);

  comment.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
};

/**
 * Show the current comment
 */
exports.read = function(req, res) {

  const comment = req.comment ? req.comment.toJSON() : {};
  res.json(req.comment);
};

/**
 * Update an comment
 */
exports.update = function(req, res) {

  const comment = _.extend(req.comment, req.body);

  comment.updated = Date.now();
  comment.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
};

/**
 * Delete an comment
 */
exports.remove = function(req, res) {
  const comment = req.comment;

  comment.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(comment);
    }
  });
};

/**
 * List of comments
 */
exports.list = function(req, res) {
  Comment.find()
    .sort('-created')
    .populate('user')
    .exec((err, comments) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(comments);
      }
    });
};

/**
 * Comment middleware
 */
exports.commentById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'comment is invalid'
    });
  }

  Comment.findById(id)
    .populate('user')
    .exec((err, comment) => {
      if (err) {
        return next(err);
      } else if (!comment) {
        return res.status(404).send({
          message: 'No comment with that identifier has been found'
        });
      }
      req.comment = comment;
      next();
    });
};

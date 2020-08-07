/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const TutorBoard = mongoose.model('TutorBoard');

/**
 * Create an Daily Report
 */
exports.create = function(req, res) {

  const tutorBoard = new TutorBoard(req.body);
  tutorBoard.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tutorBoard);
    }
  });

};

/**
 * Show the current tutorBoard
 */
exports.read = function(req, res) {
  const tutorBoard = req.tutorBoard ? req.tutorBoard.toJSON() : {};
  res.json(tutorBoard);
};

/**
 * Update an tutorBoard
 */
exports.update = function(req, res) {

  const tutorBoard = _.extend(req.tutorBoard, req.body);

  tutorBoard.updated = Date.now();

  tutorBoard.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tutorBoard);
    }
  });
};

/**
 * Delete an tutorBoard
 */
exports.remove = function(req, res) {
  const tutorBoard = req.tutorBoard;

  tutorBoard.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(tutorBoard);
    }
  });
};

/**
 * List of tutorBoards
 */
exports.list = function(req, res) {

  const user = req.user;

  const conditions = {
    category: 'tutorBoard'
  };
  if (user.roles[0] === 'tutor') {
    conditions.tutors = {
      $in: [user._id]
    };
  }

  TutorBoard.find(conditions)
    .sort('-counters')
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutors',
      select: '-password -salt'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username nickName roles created profileImage'
      }
    })
    .populate('attachmentFiles')
    .exec((err, tutorBoards) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(tutorBoards);
      }
    });
};

/**
 * Tutor Board middleware
 */
exports.tutorBoardById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'tutor board is invalid'
    });
  }

  TutorBoard.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutors',
      select: '-password -salt'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username nickName roles created profileImage'
      }
    })
    .populate('attachmentFiles')
    .exec((err, tutorBoard) => {
      if (err) {
        return next(err);
      } else if (!tutorBoard) {
        return res.status(404).send({
          message: 'No tutor board with that identifier has been found'
        });
      }
      req.tutorBoard = tutorBoard;
      next();
    });
};

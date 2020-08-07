/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Monthly = mongoose.model('Monthly');
const moment = require('moment');

/**
 * Create an Monthly
 */
exports.save = function(req, res) {
  const monthly = new Monthly(req.body);
  monthly.evaluation = req.evaluation._id;
  monthly.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(monthly);
    }
  });
};

/**
 * Many create an schedules
 */
exports.create = function(req, res) {
  const documents = req.body;
  const evaluations = req.evaluations;

  const monthlies = documents.map((doc, i) => {
    doc.evaluation = evaluations[i]._id;
    return new Monthly(doc);
  });

  Monthly.create(monthlies, (err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(monthlies);
  });
};

/**
 * Show the current Monthly
 */
exports.read = function(req, res) {
  const monthly = req.monthly ? req.monthly.toJSON() : {};
  res.json(monthly);
};

/**
 * Update an Monthly
 */
exports.update = function(req, res) {

  const monthly = _.extend(req.monthly, req.body);
  monthly.updated = Date.now();
  monthly.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(monthly);
    }
  });
};

/**
 * Delete an Monthly
 */
exports.remove = function(req, res) {
  const monthly = req.monthly;

  monthly.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(monthly);
    }
  });
};

/**
 * List of monthly evaluation
 */
exports.listByMemberId = function(req, res) {

  const member = req.member;

  Monthly.find({
      user: member._id,
      scheduleType: ['monthly']
    })
    .populate({
      path: 'tutors',
      select: '-password -salt'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'payment user'
      }
    })
    .sort('-created -started')
    .exec((err, monthlies) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(monthlies);
      }
    });
};

/**
 * List of Lessons
 */
exports.listByCourseId = function(req, res) {

  const course = req.course;

  Monthly.find({
      course: course._id,
      scheduleType: 'monthly'
    })
    .populate({
      path: 'tutors',
      select: '-password -salt'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'startLesson',
        select: 'started'
      }
    })
    .populate({
      path: 'course',
      populate: {
        path: 'endLesson',
        select: 'started'
      }
    })
    .sort('started')
    .exec((err, lessons) => {
      if (err) {
        console.log(err);

        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(lessons);
      }
    });
};

/**
 * List of monthly evaluations
 */
exports.list = function(req, res) {
  const user = req.user;
  const conditions = {
    providers: {
      $in: user.providers
    }
  };


  if (user.roles[0] === 'tutor') {
    conditions.tutors = {
      $in: [user._id]
    };
    delete conditions.providers;
  }

  Monthly.find(conditions)
    .populate({
      path: 'tutors',
      select: '-password -salt'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'payment'
      }
    })
    .sort('-created -started')
    .exec((err, monthlies) => {

      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(monthlies);
      }
    });
};

/**
 * List of today
 */
exports.monthByList = function(req, res) {
  const user = req.user;

  Monthly.find({
      providers: {
        $in: user.providers
      },
      started: {
        $gte: moment(req.params.month).startOf('month'),
        $lte: moment(req.params.month).endOf('month')
      },
      scheduleType: 'monthly'
    })
    .populate({
      path: 'tutors',
      select: '-password -salt'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'payment'
      }
    })
    .sort('-started')
    .exec((err, monthlies) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(monthlies);
      }
    });
};

/**
 * Monthly Evaluation middleware
 */
exports.monthlyById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Monthly Evaluation is invalid'
    });
  }

  Monthly.findById(id)
    .populate({
      path: 'tutors',
      select: '-password -salt'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'payment'
      }
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username nickName roles created profileImage'
      }
    })
    .populate('evaluation')
    .exec((err, monthly) => {
      if (err) {
        return next(err);
      } else if (!monthly) {
        return res.status(404).send({
          message: 'No monthly evaluation with that identifier has been found'
        });
      }
      req.monthly = monthly;
      next();
    });
};

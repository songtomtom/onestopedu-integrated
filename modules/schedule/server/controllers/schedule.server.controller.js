/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const moment = require('moment');
const Schedule = mongoose.model('Schedule');

/**
 * Create an Schedule
 */
exports.create = function(req, res) {

  const schedule = new Schedule(req.body);

  schedule.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedule);
    }
  });
};

/**
 * Many create an schedules
 */
exports.createMany = function(req, res) {
  const schedules = req.body.schedules;

  Schedule.create(schedules, (err, response) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(response);
    }
  });
};

/**
 * Show the current Schedule
 */
exports.read = function(req, res) {
  const schedule = req.schedule ? req.schedule.toJSON() : {};
  res.json(schedule);
};

/**
 * Update an Schedule
 */
exports.update = function(req, res) {

  const schedule = _.extend(req.schedule, req.body);
  schedule.updated = Date.now();
  schedule.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(schedule);
    }
  });
};

/**
 * Delete an Schedule
 */
exports.remove = function(req, res) {
  const schedule = req.schedule;

  schedule.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(schedule);
    }
  });
};

/**
 * List of Schedules
 */
exports.list = function(req, res) {
  const user = req.user;

  Schedule.find({
      providers: {
        $in: user.providers
      },
      tutor: {
        $exists: true
      }
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutor',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'payment user'
      }
    })
    .exec((err, schedules) => {

      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(schedules);
      }
    });
};

/**
 * List of member by schedules
 */
exports.listByMemberId = function(req, res) {

  const member = req.member;
  Schedule.find({
      user: member._id
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutor',
      select: '-password -salt'
    })
    .exec((err, schedules) => {

      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(schedules);
      }
    });
};

/**
 * List of tutor by schedules
 */
exports.tutorByList = function(req, res) {

  const tutor = req.tutor;

  Schedule.find({
      tutor: tutor._id
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutor',
      select: '-password -salt'
    })
    .exec((err, schedules) => {

      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(schedules);
      }
    });
};

/**
 * List of tutor
 */
exports.dayByList = function(req, res) {

  const user = req.user;

  const selected = moment(req.params.day)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const ended = selected.clone().add(1, 'days');

  // Schedule query conditions
  const conditions = {
    providers: {
      $in: user.providers
    },
    started: {
      $gte: selected,
      $lte: ended
    },
    state: {
      $nin: ['hold']
    },
    scheduleType: ['leveltest', 'lesson']

  };

  if (user.roles[0] === 'tutor') {
    // In tutor
    conditions.tutor = user._id;
    delete conditions.providers;
  }


  Schedule.find(conditions)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutor',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'payment'
      }
    })
    .sort('started')
    .exec((err, schedules) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(schedules);
      }
    });
};

/**
 * List of Schedules
 */
exports.tutorPossibleByList = function(req, res) {
  const dates = req.body.dates;
  const matchConditions = dates.map((date) => {
    return {
      started: {
        $lt: moment(date.ended).toDate()
      },
      ended: {
        $gt: moment(date.started).toDate()
      }
    };
  });

  Schedule.aggregate([{
      $match: {
        $or: matchConditions
      }
    }, {
      $group: {
        _id: {
          tutor: '$tutor'
        }
      }
    }])
    .exec((err, tutorIds) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        const impossibleTutorByIds = tutorIds.map((tutorId) => {
          return tutorId._id.tutor;
        });

        const Tutor = mongoose.model('Tutor');

        Tutor.find({
            // _id: {
            //   $nin: impossibleTutorByIds
            // },
            roles: ['tutor']
          })
          .select('-password -salt')
          .exec((err, tutors) => {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              tutors = tutors.map((tutor) => {
                if (impossibleTutorByIds.indexOf(tutor._id) > 0) {
                  tutor.state = 'impossible';
                } else {
                  tutor.state = 'possible';
                }
                return tutor;
              });
              res.json(tutors);
            }
          });
      }
    });
};

/**
 * Schedule middleware
 */
exports.scheduleById = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'schedule is invalid'
    });
  }

  Schedule.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutor',
      select: '-password -salt'
    })
    .populate({
      path: 'course',
      populate: {
        path: 'payment user'
      }
    })
    .exec((err, schedule) => {
      if (err) {
        return next(err);
      } else if (!schedule) {
        return res.status(404).send({
          message: 'No schedule with that identifier has been found'
        });
      }
      req.schedule = schedule;
      next();
    });
};

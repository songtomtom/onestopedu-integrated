/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const moment = require('moment');
const config = require(path.resolve('./config/config'));
const Course = mongoose.model('Course');

/**
 * Create an course
 */
exports.save = function(req, res, next) {
  const course = new Course(req.body);

  course.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Course.populate(course, {
        path: 'payment'
      }, (err) => {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        res.json(course);
      });
    }
  });
};

/**
 * Show the current Course
 */
exports.read = function(req, res) {
  const course = req.course ? req.course.toJSON() : {};
  res.json(course);
};

/**
 * Update an Course
 */
exports.update = function(req, res) {
  const course = _.extend(req.course, req.body);
  course.updated = Date.now();
  course.save((err) => {

    if (err) {
      console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(course);
    }
  });
};

/**
 * Delete an Course
 */
exports.remove = function(req, res) {
  const course = req.course;

  course.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(course);
    }
  });
};

/**
 * List of Lessons
 */
exports.list = function(req, res) {

  const user = req.user;

  Course.find({
      providers: {
        $in: user.providers
      }
    })
    .populate({
      path: 'mainTutor',
      select: '-password -salt'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'payment',
      populate: {
        path: 'user',
        select: '-password -salt'
      }
    })
    .populate({
      path: 'startLesson',
      select: 'state started'
    })
    .populate({
      path: 'endLesson',
      select: 'state started'
    })
    .sort('-created')
    .exec((err, courses) => {
      if (err) {

        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(courses);
      }
    });
};

/**
 * List of lesson search for member id
 */
exports.listByMemberId = function(req, res) {

  const member = req.member;

  Course.find({
      user: member._id
    })
    .populate({
      path: 'mainTutor',
      select: '-password -salt'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'payment',
      populate: {
        path: 'user',
        select: '-password -salt'
      }
    })
    .populate({
      path: 'startLesson',
      select: 'started'
    })
    .populate({
      path: 'endLesson',
      select: 'started'
    })
    .sort('-created')
    .exec((err, courses) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(courses);
      }
    });
};

/**
 * List of absence member
 */
exports.absenceByList = function(req, res) {

  const user = req.user;
  const MAX_NOTIFY_ABSENT_COUNT = 2;

  Course.find({
      providers: {
        $in: user.providers
      },
      currentAbsenceCount: {
        $gte: MAX_NOTIFY_ABSENT_COUNT
      }
    })
    .populate('user')
    .populate({
      path: 'lessons',
      options: {
        sort: {
          started: 1
        }
      }
    })
    .sort('-created')
    .exec((err, courses) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(courses);
      }
    });
};


/**
 * List of finising lessons
 */
exports.finishingByList = function(req, res) {

  const user = req.user;
  const today = moment(req.body.started)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);

  /**
   * 4: 3 + 1 day
   * 6: 3 + 1 + 2(holiday) day
   */
  const addDay = (today.day() >= 3 && today.day() < 6) ? 6 : 4;

  const compared = today.clone().add(addDay, 'days');

  Course.find({
      providers: {
        $in: user.providers
      },
      state: 'scheduled'
    })
    .select('lessons')
    .populate({
      path: 'lessons',
      match: {
        state: 'onStandby'
      },
      options: {
        sort: {
          started: -1
        },
        limit: 1
      }
    })
    .sort('-created')
    .exec((err, courses) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!courses) {
        return res.status(404).send({
          message: 'No courses with that identifier has been found'
        });
      } else {
        const lessonIds = courses.map((course) => {
          return course.lessons[0]._id;
        });

        const Lesson = mongoose.model('Lesson');
        Lesson.find({
            _id: {
              $in: lessonIds
            },
            category: 'lesson',
            started: {
              $gte: today.toDate(),
              $lte: compared.toDate()
            }
          })
          .populate({
            path: 'tutor',
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
          .exec((err, lessons) => {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(lessons);
            }
          });
      }
    });
};

/**
 * Course middleware
 */
exports.courseById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'course is invalid'
    });
  }

  Course.findById(id)
    .populate({
      path: 'mainTutor',
      select: '-password -salt'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'payment',
      populate: {
        path: 'user',
        select: '-password -salt'
      }
    })
    .populate({
      path: 'startLesson',
      select: 'started'
    })
    .populate({
      path: 'endLesson',
      select: 'started'
    })
    .exec((err, course) => {
      if (err) {
        return next(err);
      } else if (!course) {
        return res.status(404).send({
          message: 'No Course with that identifier has been found'
        });
      }
      req.course = course;
      next();
    });
};

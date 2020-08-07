/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const moment = require('moment');
const async = require('async');
const Lesson = mongoose.model('Lesson');

/**
 * Create an Lesson
 */
exports.save = function(req, res) {
  const lesson = new Lesson(req.body);
  lesson.feedback = req.feedback._id;
  lesson.save((err) => {
    if (err) {
      console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lesson);
    }
  });
};

/**
 * Many create an schedules
 */
exports.create = function(req, res, next) {
  const documents = req.body;
  const feedbacks = req.feedbacks;

  const lessons = documents.map((doc, i) => {
    doc.feedback = feedbacks[i]._id;
    return new Lesson(doc);
  });

  Lesson.create(lessons, (err) => {
    if (err) {
      console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (req.course) {
      /** If change route request */
      Lesson.find({
          course: req.course._id
        })
        .select('_id')
        .sort('started')
        .exec((err, lessons) => {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(lessons);
          }
        });
    } else {
      /** If create route request */
      res.json(lessons);
    }
  });
};

/**
 * Show the current Lesson
 */
exports.read = function(req, res) {
  const lesson = req.lesson ? req.lesson.toJSON() : {};
  res.json(lesson);
};

/**
 * Update an Lesson
 */
exports.update = function(req, res) {
  const lesson = _.extend(req.lesson, req.body);
  lesson.updated = Date.now();
  lesson.save((err) => {
    if (err) {
      console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lesson);
    }
  });
};

/**
 * Delete an Lesson
 */
exports.remove = function(req, res) {
  const lesson = req.lesson;

  lesson.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(lesson);
    }
  });
};

/**
 * Many remove an schedules
 */
exports.delete = function(req, res, next) {
  const course = req.course;
  Lesson.remove({
    course: course._id,
    state: req.params.state,
    scheduleType: 'lesson'
  }, (err, response) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      next();
    }
  });
};

/**
 * List of Lessons
 */
exports.list = function(req, res) {

  const user = req.user;

  Lesson.find({
      providers: {
        $in: user.providers
      },
      scheduleType: 'lesson'
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
      select: '_id'
    })
    .sort('-started -created')
    .exec((err, lessons) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(lessons);
      }
    });
};

/**
 * Show the next lesson
 */
exports.next = function(req, res) {

  const user = req.user;
  const lesson = req.lesson;

  Lesson.findOne({
      providers: {
        $in: user.providers
      },
      course: lesson.course._id || lesson.course,
      scheduleType: 'lesson',
      started: {
        $gt: moment(lesson.started)
      }
    })
    .sort('started')
    .exec((err, lesson) => {
      console.log(lesson);
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!lesson) {
        return res.status(422).send({
          message: 'No next lesson with that identifier has been found'
        });
      } else {
        res.json(lesson);
      }
    });

};

/**
 * Show the previous lesson
 */
exports.previous = function(req, res) {

  const user = req.user;
  const lesson = req.lesson;

  Lesson.findOne({
      providers: {
        $in: user.providers
      },
      course: lesson.course._id || lesson.course,
      scheduleType: 'lesson',
      started: {
        $lt: moment(lesson.started)
      }
    })
    .sort('-started')
    .exec((err, lesson) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!lesson) {
        return res.status(422).send({
          message: 'No previous lesson with that identifier has been found'
        });
      } else {
        res.json(lesson);
      }
    });
};

/**
 * Many create an schedules
 */
exports.hold = function(req, res, next) {
  const lesson = req.lesson;

  Lesson.find({
      course: lesson.course._id || lesson.course,
      state: 'onStandby',
      started: {
        $gte: moment(lesson.started)
      },
      scheduleType: 'lesson'
    })
    .exec((err, docs) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        const wordloads = docs.map((doc) => {
          return new Promise((resolve, reject) => {
            const lesson = new Lesson(doc);
            lesson.state = 'hold';
            lesson.save((err, lesson) => {
              if (err) {
                return reject(err);
              }
              return resolve(lesson);
            });
          });
        });

        Promise.all(wordloads)
          .then((results) => {
            res.json(results);
          })
          .catch((err) => {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          });
      }
    });
};

/**
 * Many create an schedules
 */
exports.unHold = function(req, res, next) {
  const course = req.course;

  Lesson.find({
      course: course._id,
      state: 'hold',
      scheduleType: 'lesson'
    })
    .exec((err, docs) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        const wordloads = docs.map((doc) => {
          return new Promise((resolve, reject) => {
            const lesson = new Lesson(doc);
            lesson.state = 'onStandby';
            lesson.updated = Date.now();
            lesson.save((err, lesson) => {
              if (err) {
                return reject(err);
              }
              return resolve(lesson);
            });
          });
        });

        Promise.all(wordloads)
          .then((results) => {
            res.json(results);
          })
          .catch((err) => {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          });
      }
    });
};

/**
 * Postpone original lesson next save new lesson
 */
exports.postpone = function(req, res) {

  const postpone = req.lesson;

  postpone.state = 'postpone';
  postpone.updated = Date.now();
  postpone.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      const newLesson = new Lesson(req.body);
      newLesson.feedback = req.feedback._id;

      newLesson.save((err) => {
        if (err) {
          console.log(err);
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(postpone);
        }
      });
    }
  });
};

/**
 * Revert postpon lesson and remove last on standby lesson
 */
exports.revert = function(req, res) {

  const postpone = req.lesson;

  postpone.state = 'onStandby';
  postpone.updated = Date.now();
  postpone.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Lesson.findOne({
          _id: postpone.course.endLesson._id,
          course: postpone.course._id,
          scheduleType: 'lesson'
        })
        .exec((err, lesson) => {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else if (!lesson) {
            return res.status(404).send({
              message: 'No Lesson with that identifier has been found'
            });
          } else if (lesson.state !== 'onStandby') {
            return res.status(500).send({
              message: 'Last lesson state is not "onStandby", Please check last lesson state'
            });
          } else {

            lesson.remove((err) => {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {

                res.json(postpone);
              }
            });
          }
        });
    }
  });
};

/**
 * List of Lessons
 */
exports.dateByList = function(req, res) {

  const user = req.user;

  const started = moment(req.body.started)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const ended = moment(req.body.ended);

  Lesson.find({
      providers: {
        $in: user.providers
      },
      scheduleType: 'lesson',
      started: {
        $gte: started,
        $lte: ended
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
        path: 'payment'
      }
    })
    .sort('-created')
    .exec((err, lessons) => {
      if (err) {

        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(lessons);
      }
    });
};

/**
 * List of Lessons
 */
exports.listByCourseId = function(req, res) {

  const course = req.course;

  Lesson.find({
      course: course._id,
      scheduleType: 'lesson'
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
        path: 'payment'
      }
    })
    .sort('started')
    .exec((err, lessons) => {
      if (err) {

        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(lessons);
      }
    });
};

/**
 * List of lesson search for member id
 */
exports.listByMemberId = function(req, res) {

  const member = req.member;

  Lesson.find({
      user: member._id,
      scheduleType: 'lesson'
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
        path: 'payment'
      }
    })
    .sort('-created')
    .exec((err, lessons) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(lessons);
      }
    });
};

/**
 * List of lately
 */
exports.recent = function(req, res) {
  const member = req.member;

  const started = moment()
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);

  Lesson.findOne({
      user: member._id,
      scheduleType: 'lesson',
      state: 'onStandby'
    })
    .select('_id')
    .sort('started')
    .exec((err, lesson) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(lesson);
      }
    });
};

/**
 * Lesson middleware
 */
exports.lessonById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'lesson is invalid'
    });
  }

  Lesson.findById(id)
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
        path: 'payment'
      }
    })
    .populate({
      path: 'course',
      populate: {
        path: 'mainTutor',
        select: 'nickName'
      }
    })
    .populate({
      path: 'course',
      populate: {
        path: 'startLesson',
        select: 'state started'
      }
    })
    .populate({
      path: 'course',
      populate: {
        path: 'endLesson',
        select: 'state started'
      }
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username nickName roles created profileImage'
      }
    })
    .populate('feedback')
    .exec((err, lesson) => {
      if (err) {
        return next(err);
      } else if (!lesson) {
        return res.status(404).send({
          message: 'No Lesson with that identifier has been found'
        });
      }
      req.lesson = lesson;
      next();
    });
};

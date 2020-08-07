/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const path = require('path');
const env = require(path.resolve('./config/env/default'));
const autoIncrement = require('mongoose-auto-increment-fix');

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * Lesson Schema
 */
const LessonSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tutor'
  },
  feedback: {
    type: mongoose.Schema.ObjectId,
    ref: 'Feedback'
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
  },
  comments: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Comment'
    }]
  },

  providers: {
    type: [{
      type: String,
      enum: env.providers
    }],
    trim: true,
    required: 'Please you must select one provider'
  },

  state: {
    type: String,
    enum: [
      'onStandby',
      'attendance',
      'absence',
      'canceled',
      'tutorCanceled',
      'technicalProblem',
      'dayOff',
      'hold',
      'postpone'
    ],
    default: 'onStandby'
  },

  productType: {
    type: String,
    enum: env.productType
  },
  scheduleType: {
    type: String,
    enum: ['lesson'],
    default: 'lesson'
  },

  lessonType: {
    type: String,
    enum: ['start', 'normal', 'end'],
    default: 'normal'
  },

  minutes: {
    type: Number,
    enum: [10, 20, 30],
    default: 10
  },

  started: {
    type: Date
  },
  ended: {
    type: Date
  },

  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/** Hook a post save method callback */
LessonSchema.post('save', postCallback);
/** Hook a post remove method callback */
LessonSchema.post('remove', postCallback);

/**
 * Post callback
 */
function postCallback(doc, next) {

  /**
   * Model Requirement
   */
  const Course = mongoose.model('Course');
  const Lesson = mongoose.model('Lesson');

  /**
   * When lessons are save/create or delete/remove everytime
   * The whole lessons are counting current state
   * And then find first lesson and the last lesson.
   * And then Updating the parent course.
   */
  stating(doc)
    .then(findFirst)
    .then(findLast)
    .then((values) => {
      Course.findOneAndUpdate({
          _id: values.courseId
        }, {
          'maxCounting.lesson': values.countingRaw.reduce((prev, curr) => {
            return (prev.count || prev) + curr.count;
          }, 0),
          'rawCounting.lesson': values.countingRaw,
          startLesson: values.firstId,
          endLesson: values.lastId
        })
        .exec((err) => {
          if (err) {
            next(err);
          }
          next();
        });
    })
    .catch((err) => {
      next(err);
    });


  /**
   * The whole lessons are counting current state
   */
  function stating() {
    return new Promise((resolve, reject) => {
      const courseId = doc.course._id || mongoose.Types.ObjectId(doc.course);
      Lesson.aggregate([{
          $match: {
            course: courseId,
            scheduleType: 'lesson'
          }
        }, {
          $group: {
            _id: {
              state: '$state'
            },
            count: {
              $sum: 1
            },
            state: {
              $first: '$state'
            }
          }
        }, {
          $project: {
            _id: 0,
            state: 1,
            count: 1
          }
        }])
        .exec((err, results) => {
          if (err) {
            return reject(err);
          }

          const values = {
            courseId,

            /** Raw */
            countingRaw: results
          };

          return resolve(values);
        });
    });
  }

  /**
   * Find first lesson
   */
  function findFirst(values) {
    return new Promise((resolve, reject) => {
      Lesson.findOneAndUpdate({
          course: values.courseId,
          scheduleType: 'lesson'
        }, {
          lessonType: 'start'
        })
        .select('_id')
        .sort('started')
        .exec((err, lesson) => {
          if (err) {
            return reject(err);
          } else {
            values.firstId = lesson._id;
            return resolve(values);
          }
        });
    });
  }

  /**
   * Find last lesson
   */
  function findLast(values) {
    return new Promise((resolve, reject) => {
      Lesson.findOneAndUpdate({
          course: values.courseId,
          scheduleType: 'lesson'
        }, {
          lessonType: 'end'
        })
        .select('_id')
        .sort('-started')
        .exec((err, lesson) => {
          if (err) {
            return reject(err);
          } else {
            values.lastId = lesson._id;
            return resolve(values);
          }
        });
    });
  }
}

/** Set virtual field display to fullcalendar event color */
LessonSchema.virtual('eventColor').get(function() {

  if (this.state === 'onStandby') {
    return '#348fe2';
  } else if (this.state === 'attendance') {
    return '#b6c2c9';
  } else if (this.state === 'absence' || this.state === 'canceled' || this.state === 'tutorCanceled' || this.state === 'technicalProblem') {
    return '#ff5b57';
  } else if (this.state === 'hold') {
    /** Hold */
    return '#ffd900';
  } else if (this.state === 'postpone') {
    /** Postpone */
    return '#727cb6';
  } else {
    /** Error */
    return '#2d353c';
  }
});

/** Set virtual field display to fullcalendar event color */
LessonSchema.virtual('eventBorderColor').get(function() {

  if (this.state === 'onStandby') {
    return '#348fe2';
  } else if (this.state === 'attendance') {
    return '#b6c2c9';
  } else if (this.state === 'absence' || this.state === 'canceled' || this.state === 'tutorCanceled' || this.state === 'technicalProblem') {
    return '#ff5b57';
  } else if (this.state === 'hold') {
    return '#ffd900';
  } else if (this.state === 'postpone') {
    return '#727cb6';
  } else {
    return '#2d353c';
  }
});

/**
 * Plug in auto increment
 */
LessonSchema.plugin(autoIncrement.plugin, {
  model: 'Lesson',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Lesson', LessonSchema, 'schedules');

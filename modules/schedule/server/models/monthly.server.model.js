/** Module Dependencies */
const mongoose = require('mongoose');
const path = require('path');
const env = require(path.resolve('./config/env/default'));
const autoIncrement = require('mongoose-auto-increment-fix');
const moment = require('moment');

/** Initialize auto increment */
autoIncrement.initialize(mongoose.connection);

/** Evaluation Schema */
const MonthlySchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  tutors: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Tutor'
    }]
  },
  evaluation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Evaluation'
  },
  comments: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Comment'
    }]
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
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
      'notApplicable',
      'onStandby',
      'completed'
    ],
    default: 'notApplicable'
  },

  scheduleType: {
    type: String,
    enum: ['monthly'],
    default: 'monthly'
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

/** Set virtual field display to fullcalendar event color */
MonthlySchema.virtual('eventColor').get(function() {

  if (this.state === 'onStandby') {
    return '#f59c1a';
  } else if (this.state === 'notApplicable') {
    return '#ffd900';
  } else if (this.state === 'completed') {
    return '#b6c2c9';
  } else {
    return '#2d353c';
  }
});

/** Set virtual field display to fullcalendar event border color */
MonthlySchema.virtual('eventBorderColor').get(function() {
  if (this.state === 'onStandby') {
    return '#f59c1a';
  } else if (this.state === 'notApplicable') {
    return '#ffd900';
  } else if (this.state === 'completed') {
    return '#b6c2c9';
  } else {
    return '#2d353c';
  }
});

/** Hook a pre save method to evaluation state */
MonthlySchema.pre('save', function(next) {
  if (this.state && this.isNew) {
    const started = moment(this.started).clone();
    if (moment().isAfter(started)) {
      this.state = 'onStandby';
    }
  }
  next();
});

/** Hook a post save method callback */
MonthlySchema.post('save', postCallback);
/** Hook a post remove method callback */
MonthlySchema.post('remove', postCallback);

/**
 * Post callback
 */
function postCallback(doc, next) {

  /**
   * Model Requirement
   */
  const Course = mongoose.model('Course');
  const Monthly = mongoose.model('Monthly');

  /**
   * When monthly evaluations are save/create or delete/remove everytime
   * The whole monthly evaluations are counting current state
   */
  stating(doc)
    .then((values) => {
      Course.findOneAndUpdate({
          _id: values.courseId
        }, {
          'rawCounting.monthly': values.countingRaw
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
   * The whole monthly evaluations are counting current state
   */
  function stating() {
    return new Promise((resolve, reject) => {
      const courseId = doc.course._id || mongoose.Types.ObjectId(doc.course);
      Monthly.aggregate([{
          $match: {
            course: courseId,
            scheduleType: 'monthly'
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
}

/** Virtual setting to josn parsing */
MonthlySchema.set('toJSON', {
  virtuals: true
});

/** Plug in auto increment */
MonthlySchema.plugin(autoIncrement.plugin, {
  model: 'Monthly',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/** Schema Compile */
mongoose.model('Monthly', MonthlySchema, 'schedules');

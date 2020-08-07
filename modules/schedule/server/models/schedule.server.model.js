/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const path = require('path');
const env = require(path.resolve('./config/env/default'));
const moment = require('moment');
const autoIncrement = require('mongoose-auto-increment-fix');

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * Schedule Schema
 */
const ScheduleSchema = new mongoose.Schema({
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

  productType: {
    type: String,
    enum: env.productType
  },
  scheduleType: {
    type: String,
    enum: ['leveltest', 'lesson', 'monthly', 'postpone', 'breaktime']
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

      /** Leveltest */
      'applied',

      /** Lesson */
      'hold',
      'postpone',

      /** Common */
      'onStandby',
      'attendance',
      'absence',
      'canceled',
      'tutorCanceled',
      'technicalProblem'
    ]
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
ScheduleSchema.virtual('eventColor').get(function() {
  if (this.scheduleType === 'lesson') {
    return '#348fe2';
  } else if (this.scheduleType === 'leveltest') {
    return '#00acac';
  } else if (this.scheduleType === 'monthly') {
    return '#f59c1a';
  }
});

/** Set virtual field title */
ScheduleSchema.virtual('title').get(function() {

  let header;
  let started;
  let ended;

  if (this.scheduleType === 'lesson' || this.scheduleType === 'leveltest') {

    header = this.productType.charAt(0).toUpperCase() + this.productType.slice(1);
    started = moment(this.started).format('HH:mm');
    ended = moment(this.ended).format('HH:mm');

  } else if (this.scheduleType === 'monthly') {

    header = 'Evaluation';
    started = moment(this.started).format('YYYY/MM/DD');
    ended = moment(this.ended).format('YYYY/MM/DD');
  }

  return `${header} | ${started}~${ended}`;
});

/** Set virtual field title */
ScheduleSchema.virtual('stateName').get(function() {
  if (this.scheduleType === 'lesson') {
    return '#348fe2';
  } else if (this.scheduleType === 'leveltest') {
    return '#00acac';
  } else if (this.scheduleType === 'monthly') {
    return '#f59c1a';
  }
});

/**
 * Virtual setting to josn parsing
 */
ScheduleSchema.set('toJSON', {
  virtuals: true
});

/**
 * Plug in auto increment
 */
ScheduleSchema.plugin(autoIncrement.plugin, {
  model: 'Schedule',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Schedule', ScheduleSchema);

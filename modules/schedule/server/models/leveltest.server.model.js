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
 * Leveltest Schema
 */
const LeveltestSchema = new mongoose.Schema({
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
  assessment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Assessment'
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
      'applied',
      'onStandby',
      'attendance',
      'absence',
      'canceled',
      'tutorCanceled',
      'technicalProblem'
    ],
    default: 'applied'
  },

  productType: {
    type: String,
    enum: env.productType
  },
  scheduleType: {
    type: String,
    enum: ['leveltest'],
    default: 'leveltest'
  },
  application: {
    productType: {
      type: String,
      enum: env.productType
    },
    minutes: {
      type: Number,
      enum: [10, 20, 30],
      default: 10
    },

    /**
     * novice: "왕초보 수준"
     * conversation: "기본대화 가능"
     * communication: "의사소통 원활"
     * debate: "주제토론 가능"
     */
    skill: {
      type: String,
      enum: [
        'novice',
        'conversation',
        'communication',
        'debate'
      ],
      default: 'novice'
    },
    desired: {
      type: Date
    },
    memo: {
      type: String
    }
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

/**
 * Set virtual field display to skill
 */
LeveltestSchema.virtual('displaySkill')
  .get(function() {
    if (this.application.skill === 'novice') {
      return '왕초보 수준';
    } else if (this.application.skill === 'conversation') {
      return '기본대화 가능';
    } else if (this.application.skill === 'communication') {
      return '의사소통 원활';
    } else if (this.application.skill === 'debate') {
      return '주제토론 가능';
    } else {
      return '왕초보 수준';
    }
  });

/**
 * Set virtual field display to fullcalendar event color
 */
LeveltestSchema.virtual('sortNumber')
  .get(function() {

    if (this.state === 'onStandby') {
      return 20;
    } else if (this.state === 'attendance') {
      return 40;
    } else if (this.state === 'absence' || this.state === 'canceled' || this.state === 'tutorCanceled' || this.state === 'technicalProblem') {
      return 30;
    } else if (this.state === 'applied') {
      return 10;
    } else {
      return 0;
    }
  });

/**
 * Set virtual field display to fullcalendar event color
 */
LeveltestSchema.virtual('eventColor')
  .get(function() {

    if (this.state === 'onStandby') {

      /**
       * On Standby
       * Leveltest
       */
      return '#00acac';
    } else if (this.state === 'attendance') {

      /**
       * Attendance
       */
      return '#b6c2c9';
    } else if (this.state === 'absence' || this.state === 'canceled' || this.state === 'tutorCanceled' || this.state === 'technicalProblem') {

      /**
       * Absence
       * Canceled
       * TC(tutorCanceled)
       * TP(technicalProblem)
       */
      return '#ff5b57';
    } else if (this.state === 'applied') {

      /**
       * Applied
       */
      return '#ffd900';
    } else {

      /**
       * Error
       */
      return '#2d353c';
    }
  });

/**
 * Set virtual field display to fullcalendar event border color
 */
LeveltestSchema.virtual('eventBorderColor')
  .get(function() {

    if (this.state === 'onStandby') {

      /**
       * On Standby
       * Leveltest
       */
      return '#00acac';
    } else if (this.state === 'attendance') {

      /**
       * Attendance
       */
      return '#b6c2c9';
    } else if (this.state === 'absence' || this.state === 'canceled' || this.state === 'tutorCanceled' || this.state === 'technicalProblem') {

      /**
       * Absence
       * Canceled
       * TC(tutorCanceled)
       * TP(technicalProblem)
       */
      return '#ff5b57';
    } else if (this.state === 'applied') {

      /**
       * Applied
       */
      return '#ffd900';
    } else {

      /**
       * Error
       */
      return '#2d353c';
    }
  });

/**
 * Virtual setting to josn parsing
 */
LeveltestSchema.set('toJSON', {
  virtuals: true
});


/**
 * Plug in auto increment
 */
LeveltestSchema.plugin(autoIncrement.plugin, {
  model: 'Leveltest',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Leveltest', LeveltestSchema, 'schedules');

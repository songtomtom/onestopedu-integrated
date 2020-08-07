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
 * Course Schema
 */
const CourseSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  mainTutor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tutor'
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment'
  },

  hold: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hold'
  },

  startLesson: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson'
  },
  endLesson: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson'
  },

  providers: {
    type: [{
      type: String,
      enum: env.providers
    }],
    trim: true,
    required: 'Please you must select one provider'
  },

  virtualProduct: {
    productType: {
      type: String,
      enum: env.productType
    },
    curriculum: {
      type: String,
      enum: ['conversation', 'freeTalking', 'business', 'interview', 'examPreparation']
    },
    nation: {
      type: String,
      enum: ['bulgaria', 'philippines', 'northAmerica']
    },
    month: {
      type: Number,
      enum: [1, 3, 6, 12]
    },
    times: {
      type: Number,
      enum: [2, 3, 5]
    },
    minutes: {
      type: Number,
      enum: [10, 20]
    }
  },
  state: {
    type: String,
    enum: [
      'scheduled',
      'inProgress',
      'hold',
      'completed'
    ],
    default: 'scheduled'
  },
  daysOfWeek: [],
  rawCounting: {
    lesson: {},
    monthly: {}
  },
  maxCounting: {
    lesson: {
      type: Number,
      default: 0
    },
    postpone: {
      type: Number,
      default: 0
    },
    hold: {
      type: Number,
      default: 2
    }
  },
  useCounting: {
    postpone: {
      type: Number,
      default: 0
    },
    hold: {
      type: Number,
      default: 0
    }
  },

  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/** Set virtual field title */
CourseSchema.virtual('virtualProduct.title').get(function() {
  let curriculum;
  let nation;
  let productType;

  if (this.virtualProduct.curriculum === 'conversation') {
    curriculum = '정규회화';
  } else if (this.virtualProduct.curriculum === 'freeTalking') {
    curriculum = '프리토킹';
  } else if (this.virtualProduct.curriculum === 'business') {
    curriculum = '비즈니스';
  } else if (this.virtualProduct.curriculum === 'interview') {
    curriculum = '인터뷰';
  } else if (this.virtualProduct.curriculum === 'examPreparation') {
    curriculum = '시험대비';
  }

  if (this.virtualProduct.productType === 'telephone') {
    productType = '전화';
  } else if (this.virtualProduct.productType === 'skype') {
    productType = '스카이프';
  } else if (this.virtualProduct.productType === 'screenBoard') {
    productType = '화상칠판';
  }

  if (this.virtualProduct.nation === 'bulgaria') {
    nation = '유럽';
  } else if (this.virtualProduct.nation === 'philippines') {
    nation = '필리핀';
  } else if (this.virtualProduct.nation === 'northAmerica') {
    nation = '미주';
  }
  // return `${this.counters}. ${productType} | ${curriculum} | ${nation} | ${this.virtualProduct.month}개월 주${this.virtualProduct.times}회 ${this.virtualProduct.minutes}분`;
  return `${productType} | ${curriculum} | ${nation} | ${this.virtualProduct.month}개월 주${this.virtualProduct.times}회 ${this.virtualProduct.minutes}분`;
});

/** Set virtual field on standby count */
CourseSchema.virtual('currentCounting.lesson.onStandby').get(function() {
  let count = 0;

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (item.state === 'onStandby') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field attendance count */
CourseSchema.virtual('currentCounting.lesson.attendance').get(function() {
  let count = 0;

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (item.state === 'attendance') {
        count = item.count;
      }
    });
  }

  return count;
});


/** Set virtual field absence count */
CourseSchema.virtual('currentCounting.lesson.absence').get(function() {
  let count = 0;

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (item.state === 'absence') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field canceled count */
CourseSchema.virtual('currentCounting.lesson.canceled').get(function() {
  let count = 0;

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (item.state === 'canceled') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field tutor canceled count */
CourseSchema.virtual('currentCounting.lesson.tutorCanceled').get(function() {
  let count = 0;

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (item.state === 'tutorCanceled') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field technical problem count */
CourseSchema.virtual('currentCounting.lesson.technicalProblem').get(function() {
  let count = 0;

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (item.state === 'technicalProblem') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field day off count */
CourseSchema.virtual('currentCounting.lesson.dayOff').get(function() {
  let count = 0;

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (item.state === 'dayOff') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field hold count */
CourseSchema.virtual('currentCounting.lesson.hold').get(function() {
  let count = 0;

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (item.state === 'hold') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field postpone count */
CourseSchema.virtual('currentCounting.lesson.postpone').get(function() {
  let count = 0;

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (item.state === 'postpone') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field complete rate */
CourseSchema.virtual('currentCounting.lesson.total').get(function() {

  let count = 0;
  let minus = 0;
  const minusState = ['postpone', 'hold'];

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (minusState.includes(item.state)) {
        minus += item.count;
      }
      count += item.count;
    });
  }

  return count - minus;
});

/** Set virtual field complete rate */
CourseSchema.virtual('currentCounting.lesson.fail').get(function() {

  let count = 0;
  const failStates = ['absence', 'canceled', 'tutorCanceled', 'technicalProblem', 'dayOff'];

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (failStates.includes(item.state)) {
        count += item.count;
      }
    });
  }

  return count;
});

/** Set virtual field complete rate */
CourseSchema.virtual('currentCounting.lesson.success').get(function() {

  let count = 0;
  const successStates = ['attendance'];

  if (this.rawCounting.lesson && this.rawCounting.lesson.length > 0) {
    this.rawCounting.lesson.forEach((item) => {
      if (successStates.includes(item.state)) {
        count += item.count;
      }
    });
  }

  return count;
});


/** Set virtual field complete rate */
CourseSchema.virtual('currentCounting.lesson.completed').get(function() {
  let count = 0;

  if (this.currentCounting.lesson) {
    count = (this.currentCounting.lesson.success || 0) + (this.currentCounting.lesson.fail || 0);
  }

  return count;
});


/** Set virtual field complete rate */
CourseSchema.virtual('rating.lesson.completed').get(function() {
  let rate = 0;
  if (this.currentCounting.lesson && this.maxCounting && this.maxCounting.lesson) {
    rate = Math.ceil((((this.currentCounting.lesson.success || 0) + (this.currentCounting.lesson.fail || 0)) / this.maxCounting.lesson) * 100);
  }
  return rate;
});

/** Set virtual field attendance rate */
CourseSchema.virtual('rating.lesson.success').get(function() {
  let rate = 0;
  if (this.currentCounting.lesson && this.maxCounting && this.maxCounting.lesson) {
    rate = Math.ceil(((this.currentCounting.lesson.success || 0) / this.maxCounting.lesson) * 100);
  }
  return rate;
});

/** Set virtual field cancel rate */
CourseSchema.virtual('rating.lesson.fail').get(function() {
  let rate = 0;
  if (this.currentCounting.lesson && this.maxCounting && this.maxCounting.lesson) {
    rate = Math.ceil(((this.currentCounting.lesson.fail || 0) / this.maxCounting.lesson) * 100);
  }
  return rate;
});

/** Set virtual field cancel rate */
CourseSchema.virtual('rating.lesson.hold').get(function() {
  let rate = 0;
  if (this.currentCounting.lesson && this.maxCounting && this.maxCounting.lesson) {
    rate = Math.ceil(((this.currentCounting.lesson.hold || 0) / this.maxCounting.lesson) * 100);
  }
  return rate;
});


/** Set virtual field not applicable count */
CourseSchema.virtual('currentCounting.monthly.notApplicable').get(function() {
  let count = 0;

  if (this.rawCounting.monthly && this.rawCounting.monthly.length > 0) {
    this.rawCounting.monthly.forEach((item) => {
      if (item.state === 'notApplicable') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field on standby count */
CourseSchema.virtual('currentCounting.monthly.onStandby').get(function() {
  let count = 0;

  if (this.rawCounting.monthly && this.rawCounting.monthly.length > 0) {
    this.rawCounting.monthly.forEach((item) => {
      if (item.state === 'onStandby') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field completed count */
CourseSchema.virtual('currentCounting.monthly.completed').get(function() {
  let count = 0;

  if (this.rawCounting.monthly && this.rawCounting.monthly.length > 0) {
    this.rawCounting.monthly.forEach((item) => {
      if (item.state === 'completed') {
        count = item.count;
      }
    });
  }

  return count;
});

/** Set virtual field complete rate */
CourseSchema.virtual('currentCounting.monthly.total').get(function() {

  let count = 0;

  if (this.rawCounting.monthly && this.rawCounting.monthly.length > 0) {
    this.rawCounting.monthly.forEach((item) => {
      count += item.count;
    });
  }

  return count;
});

/** Virtual setting to josn parsing */
CourseSchema.set('toJSON', {
  virtuals: true
});

/** Plug in auto increment */
CourseSchema.plugin(autoIncrement.plugin, {
  model: 'Course',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Course', CourseSchema, 'schedules.courses');

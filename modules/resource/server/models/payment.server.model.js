/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const path = require('path');
const env = require(path.resolve('./config/env/default'));
const autoIncrement = require('mongoose-auto-increment-fix');
const moment = require('moment');

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * Payment Schema
 */
const PaymentSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  refund: {
    type: mongoose.Schema.ObjectId,
    ref: 'Refund'
  },
  paymentedProduct: {},
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
      'unPaid',
      'pending',
      'canceled',
      'completed',
      'refunded'
    ],
    default: 'pending'
  },

  order: {
    type: String
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  subLessonCount: {
    type: Number,
    default: 0
  },
  subPostponeCount: {
    type: Number,
    default: 0
  },

  method: {
    type: String,

    /**
     * DWB: Deposit Without Bankbook
     * CC: Credit Card
     * AT : Account Transfer
     * ARS: Audio Response System
     * PAYUP: Pay-up
     */
    enum: ['DWB', 'CC', 'AT', 'ARS', 'PAYUP']
  },

  ccPrice: {
    type: Number,
    default: 0
  },
  dwbPrice: {
    type: Number,
    default: 0
  },
  atPrice: {
    type: Number,
    default: 0
  },
  arsPrice: {
    type: Number,
    default: 0
  },
  payupPrice: {
    type: Number,
    default: 0
  },

  usePoint: {
    type: mongoose.Schema.ObjectId,
    ref: 'Point'
  },
  useCoupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon'
  },

  paymented: {
    type: Date
  },
  desired: {
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
 * Hook a pre save method to generate order number
 */
PaymentSchema.pre('save', function(next) {
  if (this.totalPrice && this.isModified('totalPrice')) {
    this.order = this.generateOrderNumber();
  }
  next();
});

/**
 * Create instance method for hashing a password
 */
PaymentSchema.methods.generateOrderNumber = function() {
  const possible = '0123456789';
  let order = moment().format('YYYYMMDD');

  for (let i = 0; i < 4; i += 1) {
    order += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return order;
};

/**
 * Plug in auto increment
 */
PaymentSchema.plugin(autoIncrement.plugin, {
  model: 'Payment',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Payment', PaymentSchema, 'resources.payments');

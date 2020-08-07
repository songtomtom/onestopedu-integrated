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
 * Refund Schema
 */
const RefundSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment'
  },
  providers: {
    type: [{
      type: String,
      enum: env.providers
    }],
    trim: true,
    required: 'Please you must select one provider'
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
  totalPrice: {
    type: Number,
    default: 0
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
  refundReason: {
    type: String
  },
  requested: {
    type: Date
  },
  refunded: {
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
 * Plug in auto increment
 */
RefundSchema.plugin(autoIncrement.plugin, {
  model: 'Refund',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Refund', RefundSchema, 'resources.refunds');

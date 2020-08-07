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
 * Point Schema
 */
const PointSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Member'
  },
  payer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  providers: {
    type: [{
      type: String,
      enum: env.providers
    }],
    trim: true,
    required: 'Please you must select one provider'
  },
  title: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    default: 0
  },
  pastPoint: {
    type: Number,
    default: 0
  },
  isLock: {
    type: Boolean,
    default: false
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
PointSchema.plugin(autoIncrement.plugin, {
  model: 'Point',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Point', PointSchema, 'resources.points');

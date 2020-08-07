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
 * Finishing Schema
 */
const FinishingSchema = new mongoose.Schema({
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
      'completed',
      'unDecided'
    ],
    default: 'unDecided'
  },
  title: {
    type: String
  },
  ended: {
    type: Date
  },
  reOrderd: {
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
FinishingSchema.plugin(autoIncrement.plugin, {
  model: 'Finishing',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});


/**
 * Schema Compile
 */
mongoose.model('Finishing', FinishingSchema, 'schedules.finishings');

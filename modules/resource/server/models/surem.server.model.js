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
 * Schema
 */
const SuremSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  providers: {
    type: [{
      type: String,
      enum: env.providers
    }],
    trim: true
  },
  mobile: {
    type: String
  },
  text: {
    type: String
  },
  byte: {
    type: Number,
    default: 0
  },
  sendType: {
    type: String,
    enum: ['select', 'input'],
    default: 'select'
  },
  suremType: {
    type: String,
    enum: ['SMS', 'LMS'],
    default: 'SMS'
  },
  response: {},
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
SuremSchema.plugin(autoIncrement.plugin, {
  model: 'Surem',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Shcema Compile
 */
mongoose.model('Surem', SuremSchema, 'resources.surems');

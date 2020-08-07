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
 * Textbook Schema
 */
const TextbookSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
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
    type: String
  },
  textbookFile: {
    type: mongoose.Schema.ObjectId,
    ref: 'FileItem'
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
 * Virtual setting to josn parsing
 */
TextbookSchema.set('toJSON', {
  virtuals: true
});

/**
 * Plug in auto increment
 */
TextbookSchema.plugin(autoIncrement.plugin, {
  model: 'Textbook',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Textbook', TextbookSchema, 'resources.textbooks');

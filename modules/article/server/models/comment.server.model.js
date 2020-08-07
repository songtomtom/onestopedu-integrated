/**
 * Module Dependencies
 */
const mongoose = require('mongoose');

/**
 * Schema
 */
const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  contents: {
    type: String,
    default: '',
    required: 'Contents cannot be blank'
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
 * Schema Compile
 */
mongoose.model('Comment', CommentSchema);

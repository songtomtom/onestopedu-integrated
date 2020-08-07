/**
 * Module Dependencies
 */
const mongoose = require('mongoose');

/**
 * Feedback Schema
 */
const FeedbackSchema = new mongoose.Schema({
  recordFile: {
    type: mongoose.Schema.ObjectId,
    ref: 'FileItem'
  },
  title: {
    type: String
  },
  corrections: {
    type: String
  },
  homework: {
    type: String
  },
  tutorFeedback: {
    type: String
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
mongoose.model('Feedback', FeedbackSchema, 'schedules.feedbacks');

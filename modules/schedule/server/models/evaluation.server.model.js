/**
 * Module Dependencies
 */
const mongoose = require('mongoose');

/**
 * Evaluation Schema
 */
const EvaluationSchema = new mongoose.Schema({
  listeningLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  speakingLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  pronunciationLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  vocabularyLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  grammarLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  strengths: {
    type: String
  },
  weeknesses: {
    type: String
  },
  generalComment: {
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
mongoose.model('Evaluation', EvaluationSchema, 'schedules.evaluations');

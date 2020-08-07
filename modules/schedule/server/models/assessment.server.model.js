/**
 * Module Dependencies
 */
const mongoose = require('mongoose');

/**
 * Assessment Schema
 */
const AssessmentSchema = new mongoose.Schema({
  leveltestLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  recordFile: {
    type: mongoose.Schema.ObjectId,
    ref: 'FileItem'
  },
  recommendedBook: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book'
  },
  listeningLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  listeningContents: {
    type: String
  },
  speakingLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  speakingContents: {
    type: String
  },
  pronunciationLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  pronunciationContents: {
    type: String
  },
  vocabularyLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  vocabularyContents: {
    type: String
  },
  grammarLevel: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  grammarContents: {
    type: String
  },
  tutorComment: {
    type: String
  },
  mailed: {
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
 * Schema Compile
 */
mongoose.model('Assessment', AssessmentSchema, 'schedules.assessments');

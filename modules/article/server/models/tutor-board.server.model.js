/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const path = require('path');
const env = require(path.resolve('./config/env/default'));
const chalk = require('chalk');
const autoIncrement = require('mongoose-auto-increment-fix');

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * Schema
 */
const TutorBoardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  tutors: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Tutor'
    }]
  },
  category: {
    type: String,
    enum: ['tutorBoard'],
    default: 'tutorBoard'
  },
  title: {
    type: String,
    default: '',
    required: 'Title cannot be blank'
  },
  contents: {
    type: String,
    default: '',
    required: 'Contents cannot be blank'
  },
  comments: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Comment'
    }]
  },
  attachmentFiles: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'FileItem'
    }]
  },
  counters: {
    type: Number
  },
  views: {
    type: Number,
    default: 0
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
 * Seeds the User collection with document (TutorBoard)
 * and provided options.
 */
TutorBoardSchema.statics.seed = function(doc, options) {
  const TutorBoard = mongoose.model('TutorBoard');

  return new Promise((resolve, reject) => {

    skipDocument()
      .then(findTutorManager)
      .then(findTutors)
      .then(add)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return reject(err);
      });


    function findTutorManager(skip) {
      const TutorManager = mongoose.model('TutorManager');

      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve(true);
        }

        TutorManager.findOne({
            roles: {
              $in: ['tutorManager']
            }
          })
          .exec((err, csManager) => {
            if (err) {
              return reject(err);
            }

            doc.user = csManager;
            return resolve();
          });
      });
    }

    function findTutors(skip) {
      const Tutor = mongoose.model('Tutor');

      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve(true);
        }

        Tutor.find({
            roles: {
              $in: ['tutor']
            }
          })
          .limit(5)
          .exec((err, tutors) => {
            if (err) {
              return reject(err);
            }

            doc.tutors = tutors.map((tutor) => {
              return tutor._id;
            });
            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise((resolve, reject) => {
        TutorBoard.findOne({
            title: doc.title
          })
          .exec((err, existing) => {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            /**
             * Remove TutorBoard (overwrite)
             */
            existing.remove((err) => {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve({
            message: chalk.yellow(`Database Seeding: TutorBoard "${doc.title}" skipped`)
          });
        }

        const tutorBoard = new TutorBoard(doc);

        tutorBoard.save((err) => {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: TutorBoard added'
          });
        });

      });
    }
  });
};

/**
 * Plug in auto increment
 */
TutorBoardSchema.plugin(autoIncrement.plugin, {
  model: 'TutorBoard',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('TutorBoard', TutorBoardSchema, 'articles');

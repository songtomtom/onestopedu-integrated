/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const path = require('path');
const env = require(path.resolve('./config/env/default'));
const chalk = require('chalk');
const autoIncrement = require('mongoose-auto-increment-fix');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * Schema
 */
const CourseReviewSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  category: {
    type: String,
    enum: ['courseReview'],
    default: 'courseReview'
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


  /**
   * top : Excellent course review
   */
  courseReviewType: {
    type: String,
    enum: ['top', 'normal'],
    default: 'normal'
  },

  writePoint: {
    type: mongoose.Schema.ObjectId,
    ref: 'Point'
  },

  topPoint: {
    type: mongoose.Schema.ObjectId,
    ref: 'Point'
  },

  attachmentFiles: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'FileItem'
    }]
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
 * Seeds the User collection with document (CourseReview)
 * and provided options.
 */
CourseReviewSchema.statics.seed = function(doc, options) {
  const CourseReview = mongoose.model('CourseReview');
  const Comment = mongoose.model('Comment');

  return new Promise((resolve, reject) => {

    skipDocument()
      .then(findMember)
      .then(findCSManager)
      .then(add)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return reject(err);
      });

    function findMember(skip) {
      const Member = mongoose.model('Member');

      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve(true);
        }

        const random = Math.floor(Math.random() * 10);
        Member.findOne({
            roles: {
              $in: ['member']
            }
          })
          .skip(random)
          .exec((err, member) => {
            if (err) {
              return reject(err);
            }

            doc.user = member;
            doc.providers = member.providers;
            return resolve();
          });
      });
    }

    function findCSManager(skip) {
      const CSManager = mongoose.model('CSManager');

      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve(true);
        }

        CSManager.findOne({
            roles: {
              $in: ['csManager']
            }
          })
          .exec((err, csManager) => {
            if (err) {
              return reject(err);
            }

            doc.csManager = csManager;
            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise((resolve, reject) => {
        CourseReview
          .findOne({
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
             * Remove CourseReview (overwrite)
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
            message: chalk.yellow(`Database Seeding: CourseReview "${doc.title}" skipped`)
          });
        }

        const lorem = new LoremIpsum({
          wordsPerSentence: {
            max: 16,
            min: 4
          }
        });

        const comment = new Comment({
          user: doc.csManager,
          contents: lorem.generateSentences(3)
        });

        comment.save((err) => {
          if (err) {
            return reject(err);
          }

          doc.comments = comment;

          const courseReview = new CourseReview(doc);

          courseReview.save((err) => {
            if (err) {
              return reject(err);
            }
            return resolve({
              message: 'Database Seeding: CourseReview added'
            });
          });
        });
      });
    }
  });
};

/**
 * Plug in auto increment
 */
CourseReviewSchema.plugin(autoIncrement.plugin, {
  model: 'CourseReview',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('CourseReview', CourseReviewSchema, 'articles');

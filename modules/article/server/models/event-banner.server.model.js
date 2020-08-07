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
const EventBannerSchema = new mongoose.Schema({
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
    type: String,
    default: '',
    required: 'Title cannot be blank'
  },
  mainFiles: {
    type: mongoose.Schema.ObjectId,
    ref: 'FileItem'
  },
  contentsFiles: {
    type: mongoose.Schema.ObjectId,
    ref: 'FileItem'
  },
  thumbFiles: {
    type: mongoose.Schema.ObjectId,
    ref: 'FileItem'
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
 * Seeds the User collection with document (EventBanner)
 * and provided options.
 */
EventBannerSchema.statics.seed = function(doc, options) {
  const EventBanner = mongoose.model('EventBanner');

  return new Promise((resolve, reject) => {

    skipDocument()
      .then(findCSManager)
      .then(add)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return reject(err);
      });

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

            doc.user = csManager;
            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise((resolve, reject) => {
        EventBanner.findOne({
            question: doc.question
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

            // Remove EventBanner (overwrite)

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
            message: chalk.yellow(`Database Seeding: EventBanner ${doc.question} skipped`)
          });
        }

        const eventBanner = new EventBanner(doc);

        eventBanner.save((err) => {
          if (err) {
            return reject(err);
          }
          return resolve({
            message: 'Database Seeding: EventBanner added'
          });
        });

      });
    }
  });
};

/**
 * Plug in auto increment
 */
EventBannerSchema.plugin(autoIncrement.plugin, {
  model: 'EventBanner',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('EventBanner', EventBannerSchema, 'articles.eventbanners');

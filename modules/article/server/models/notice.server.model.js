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
const NoticeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  category: {
    type: String,
    enum: ['notice'],
    default: 'notice'
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
  attachmentFiles: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'FileItem'
    }]
  },
  summernoteFiles: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'FileItem'
    }]
  },
  noticeType: {
    type: String,
    enum: ['top', 'normal'],
    default: 'normal'
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
 * Seeds the User collection with document (Notice)
 * and provided options.
 */
NoticeSchema.statics.seed = function(doc, options) {
  const Notice = mongoose.model('Notice');

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
        Notice.findOne({
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
             * Remove Notice (overwrite)
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
            message: chalk.yellow(`Database Seeding: Notice "${doc.title}" skipped`)
          });
        }

        const notice = new Notice(doc);

        notice.save((err) => {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Notice added'
          });
        });

      });
    }
  });
};

/**
 * Plug in auto increment
 */
NoticeSchema.plugin(autoIncrement.plugin, {
  model: 'Notice',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Notice', NoticeSchema, 'articles');

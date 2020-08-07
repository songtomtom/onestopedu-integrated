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
const FAQSchema = new mongoose.Schema({
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
  question: {
    type: String,
    default: '',
    required: 'Question cannot be blank'
  },
  answer: {
    type: String,
    default: '',
    required: 'Answer cannot be blank'
  },
  views: {
    type: Number,
    default: 0
  },
  counters: {
    type: Number
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
 * Seeds the User collection with document (FAQ)
 * and provided options.
 */
FAQSchema.statics.seed = function(doc, options) {
  const FAQ = mongoose.model('FAQ');

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
        FAQ.findOne({
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

            // Remove FAQ (overwrite)

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
            message: chalk.yellow(`Database Seeding: FAQ ${doc.question} skipped`)
          });
        }

        const faq = new FAQ(doc);

        faq.save((err) => {
          if (err) {
            return reject(err);
          }
          return resolve({
            message: 'Database Seeding: FAQ added'
          });
        });

      });
    }
  });
};

/**
 * Plug in auto increment
 */
FAQSchema.plugin(autoIncrement.plugin, {
  model: 'FAQ',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('FAQ', FAQSchema, 'articles.faqs');

/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const path = require('path');
const env = require(path.resolve('./config/env/default'));
const chalk = require('chalk');
const autoIncrement = require('mongoose-auto-increment-fix');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;
const validator = require('validator');

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * A Validation function for local strategy email
 */
function validateEmail(email) {
  return validator.isEmail(email, {
    require_tld: false
  });
}

/**
 * Schema
 */
const Contact1x1Schema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  comments: {
    type: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Comment'
    }]
  },
  providers: {
    type: [{
      type: String,
      enum: env.providers
    }],
    trim: true,
    required: 'Please you must select one provider'
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
 * Seeds the User collection with document (Contact1x1)
 * and provided options.
 */
Contact1x1Schema.statics.seed = function(doc, options) {
  const Contact1x1 = mongoose.model('Contact1x1');

  return new Promise((resolve, reject) => {

    skipDocument()
      .then(findMember)
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

    function skipDocument() {
      return new Promise((resolve, reject) => {

        Contact1x1
          .findOne({
            contents: doc.contents
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
             * Remove Contact1x1 (overwrite)
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
            message: chalk.yellow(`Database Seeding: Contact1x1 skipped`)
          });
        }

        const lorem = new LoremIpsum({
          wordsPerSentence: {
            max: 16,
            min: 4
          }
        });

        const contact1x1 = new Contact1x1(doc);

        contact1x1.save((err) => {
          if (err) {
            return reject(err);
          }
          return resolve({
            message: 'Database Seeding: Contact1x1 added'
          });
        });
      });
    }
  });
};

/**
 * Plug in auto increment
 */
Contact1x1Schema.plugin(autoIncrement.plugin, {
  model: 'Contact1x1',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Contact1x1', Contact1x1Schema, 'articles.contact1x1s');

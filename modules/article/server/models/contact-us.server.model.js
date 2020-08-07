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
const ContactUsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  category: {
    type: String,
    enum: ['contactUs'],
    default: 'contactUs'
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
  contactUsType: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
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
 * Seeds the User collection with document (ContactUs)
 * and provided options.
 */
ContactUsSchema.statics.seed = function(doc, options) {
  const ContactUs = mongoose.model('ContactUs');
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
        ContactUs
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
             * Remove ContactUs (overwrite)
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
            message: chalk.yellow(`Database Seeding: ContactUs "${doc.title}" skipped`)
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
          const contactUs = new ContactUs(doc);

          contactUs.save((err) => {
            if (err) {
              return reject(err);
            }
            return resolve({
              message: 'Database Seeding: ContactUs added'
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
ContactUsSchema.plugin(autoIncrement.plugin, {
  model: 'ContactUs',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('ContactUs', ContactUsSchema, 'articles');

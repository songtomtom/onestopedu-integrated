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
const PartnershipSchema = new mongoose.Schema({
  company: {
    type: String
  },
  partnerName: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    trim: true,
    default: '01000000000'
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: 'kevin@1stopasia.com',
    validate: [validateEmail, 'Please fill in your email address']
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
  counters: {
    type: Number
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
 * Seeds the User collection with document (Partnership)
 * and provided options.
 */
PartnershipSchema.statics.seed = function(doc, options) {
  const Partnership = mongoose.model('Partnership');

  return new Promise((resolve, reject) => {

    add()
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return reject(err);
      });


    function add(skip) {
      return new Promise((resolve, reject) => {
        if (skip) {
          return resolve({
            message: chalk.yellow(`Database Seeding: Partnership skipped`)
          });
        }

        const partnership = new Partnership(doc);
        partnership.save((err) => {
          if (err) {
            return reject(err);
          }
          return resolve({
            message: 'Database Seeding: Partnership added'
          });
        });
      });
    }
  });
};

/**
 * Plug in auto increment
 */
PartnershipSchema.plugin(autoIncrement.plugin, {
  model: 'Partnership',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Partnership', PartnershipSchema, 'articles.partnerships');

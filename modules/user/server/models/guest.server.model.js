/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const validator = require('validator');
const path = require('path');
const chalk = require('chalk');
const config = require(path.resolve('./config/config'));
const env = require(path.resolve('./config/env/default'));
const autoIncrement = require('mongoose-auto-increment-fix');

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * A Validation function for local strategy email
 */
function validateEmail(email) {
  return ((this.providers !== 'local' && !this.updated) || validator.isEmail(email, {
    require_tld: false
  }));
}

/**
 * A Validation function for local mobile device number
 */
function validateMobile(mobile) {
  const mobileRex = new RegExp(/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/);
  return mobile && mobileRex.test(mobile);
}

/**
 * Schema
 */
const GuestSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  username: {
    type: String,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateEmail, 'Please fill in your email address']
  },
  mobile: {
    type: String,
    trim: true,
    default: '01000000000'
  },
  koreanName: {
    type: String,
    trim: true
  },
  chineseName: {
    type: String,
    trim: true
  },
  englishName: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: 'modules/user/client/img/profile/guest.png'
  },
  providers: {
    type: [{
      type: String,
      enum: env.providers
    }],
    trim: true,
    required: 'Please you must select one provider'
  },
  roles: {
    type: [{
      type: String,
      enum: ['guest']
    }],
    default: ['guest'],
    required: 'Please provide at least one role'
  },
  skype: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    enum: ['Asia/Seoul'],
    default: 'Asia/Seoul'
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
 * Hook a pre save method to generate guest username
 */
GuestSchema.pre('save', function(next) {
  if (this.providers && this.isModified('providers')) {
    this.username = this.generateUsername();
  }
  next();
});

/**
 * Create instance method for hashing a username
 */
GuestSchema.methods.generateUsername = function() {
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';

  for (let i = 0; i < 10; i += 1) {
    username += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return username;
};

/**
 * Seeds the User collection with document (User)
 * and provided options.
 */
GuestSchema.statics.seed = function(doc, options) {
  const Guest = mongoose.model('Guest');
  return new Promise((resolve, reject) => {

    skipDocument()
      .then(add)
      .then((response) => {
        return resolve(response);
      })
      .catch((err) => {
        return reject(err);
      });

    function skipDocument() {
      return new Promise((resolve, reject) => {
        Guest.findOne({
            username: doc.username
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

            // Remove User (overwrite)
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
            message: chalk.yellow(`Database Seeding: Guest ${doc.username} skipped`)
          });
        }

        const guest = new Guest(doc);
        guest.username = guest.generateUsername();
        guest.password = 'qwe';
        guest.save((err) => {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Guest added'
          });
        });


      });
    }

  });
};

/**
 * Plug in auto increment
 */
GuestSchema.plugin(autoIncrement.plugin, {
  model: 'Guest',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Guest', GuestSchema, 'users');

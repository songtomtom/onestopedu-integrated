/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const validator = require('validator');
const path = require('path');
const crypto = require('crypto');
const chalk = require('chalk');
const generatePassword = require('generate-password');
const owasp = require('owasp-password-strength-test');
const config = require(path.resolve('./config/config'));
const env = require(path.resolve('./config/env/default'));
const autoIncrement = require('mongoose-auto-increment-fix');

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * OWASP configuration
 */
owasp.config(config.shared.owasp);

/**
 * A Validation function for local strategy email
 */
function validateEmail(email) {
  return ((this.providers !== 'local' && !this.updated) || validator.isEmail(email, {
    require_tld: false
  }));
}

/**
 * A Validation function for local strategy username
 */
function validateUsername(username) {
  const usernameRex = new RegExp(/^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/);
  return this.providers !== 'local' || (username && usernameRex.test(username) && config.illegalUsernames.indexOf(username) < 0);
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
const CSManagerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: 'Please fill in a username',
    lowercase: true,
    trim: true,
    validate: [validateUsername, 'Please fill in your User name']
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
    default: '',
    validate: [validateMobile, 'Please fill in your MDN(Mobile device number)']
  },
  languages: {
    type: [{
      type: String,
      enum: ['english', 'chinese']
    }],
    required: 'Please language at least one role'
  },
  nickName: {
    type: String,
    trim: true,
    default: ''
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
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  },
  profileImage: {
    type: String,
    default: 'modules/user/client/img/profile/default.png'
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
      enum: ['csManager']
    }],
    default: ['csManager'],
    required: 'Please provide at least one role'
  },
  timezone: {
    type: String,
    enum: ['Asia/Seoul'],
    default: 'Asia/Seoul'
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
 * Hook a pre save method to hash the password
 */
CSManagerSchema.pre('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

/**
 * Hook a pre validate method to test the local password
 */
CSManagerSchema.pre('validate', function(next) {
  if (this.providers === 'local' && this.password && this.isModified('password')) {
    const result = owasp.test(this.password);
    if (result.errors.length) {
      const error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }
  next();
});

/**
 * Create instance method for hashing a password
 */
CSManagerSchema.methods.hashPassword = function(password) {

  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
CSManagerSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
CSManagerSchema.statics.findUniqueUsername = function(username, suffix, callback) {

  const possibleUsername = username.toLowerCase() + (suffix || '');

  this.findOne({
    username: possibleUsername
  }, (err, user) => {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Generates a random passphrase that passes the owasp test
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
 */
CSManagerSchema.statics.generateRandomPassphrase = function() {
  return new Promise((resolve, reject) => {
    const repeatingCharacters = new RegExp(/(.)\\1{2,}/, 'g');
    let password = '';
    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occured while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  });
};

/**
 * Seeds the User collection with document (User)
 * and provided options.
 */
CSManagerSchema.statics.seed = function(doc, options) {
  const CSManager = mongoose.model('CSManager');
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
        CSManager.findOne({
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
            message: chalk.yellow(`Database Seeding: CSManager ${doc.username} skipped`)
          });
        }

        const csManager = new CSManager(doc);

        // user.password = passphrase;
        const password = 'qwe';
        csManager.password = password;

        csManager.save((err) => {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: CSManager added'
          });
        });
      });
    }

  });
};

/**
 * Plug in auto increment
 */
CSManagerSchema.plugin(autoIncrement.plugin, {
  model: 'CSManager',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('CSManager', CSManagerSchema, 'users');

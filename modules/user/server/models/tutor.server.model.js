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
const moment = require('moment');
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
 * Schema
 */
const TutorSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
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
  koreanName: {
    type: String,
    trim: true
  },
  englishName: {
    type: String,
    trim: true
  },
  chineseName: {
    type: String,
    trim: true
  },
  nickName: {
    type: String,
    trim: true,
    default: ''
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
  roles: {
    type: [{
      type: String,
      enum: ['tutor']
    }],
    default: ['tutor'],
    required: 'Please provide at least one role'
  },
  languages: {
    type: [{
      type: String,
      enum: ['english', 'chinese']
    }],
    required: 'Please language at least one role'
  },
  // providers: {
  //   type: [{
  //     type: String,
  //     enum: env.providers
  //   }],
  //   trim: true,
  //   required: 'Please you must select one provider'
  // },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  nation: {
    type: String,
    enum: ['bulgaria', 'philippines', 'china', 'northAmerica']
  },
  nationCode: {
    type: String,
    enum: ['BG', 'PH', 'US', 'CN']
  },
  group: {
    type: String,
    enum: ['special', 'general'],
    trim: true,
    default: 'general'
  },
  position: {
    type: String,
    enum: ['head', 'normal'],
    trim: true,
    default: 'normal'
  },
  state: {
    type: String,
    enum: ['active', 'inActive', 'withdrawal'],
    default: 'active'
  },
  timezone: {
    type: String,
    enum: [
      'Asia/Manila',
      'Asia/Shanghai',
      'Europe/Sofia',
      'America/New_York',
      'America/Chicago',
      'America/Phoenix',
      'America/Los_Angeles'
    ]
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
 * Hook a pre save nation to display name
 */
TutorSchema.pre('save', function(next) {
  if (this.nation && this.isModified('nation')) {
    switch (this.nation) {
      case 'bulgaria':
        this.nationCode = 'BG';
        break;
      case 'philippines':
        this.nationCode = 'PH';
        break;
      case 'china':
        this.nationCode = 'CN';
        break;
      case 'northAmerica':
        this.nationCode = 'US';
        break;
    }
  }

  next();
});

/**
 * Hook a pre save method to hash the password
 */
TutorSchema.pre('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

/**
 * Hook a pre validate method to test the local password
 */
TutorSchema.pre('validate', function(next) {
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
TutorSchema.methods.hashPassword = function(password) {

  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
TutorSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
TutorSchema.statics.findUniqueUsername = function(username, suffix, callback) {

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
TutorSchema.statics.generateRandomPassphrase = function() {
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
TutorSchema.statics.seed = function(doc, options) {
  const Tutor = mongoose.model('Tutor');
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
        Tutor.findOne({
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
            message: chalk.yellow(`Database Seeding: Tutor ${doc.username} skipped`)
          });
        }

        const tutor = new Tutor(doc);

        const password = 'qwe';
        tutor.password = password;

        tutor.save((err) => {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Tutor added'
          });
        });
      });
    }

  });
};

/**
 * Plug in auto increment
 */
TutorSchema.plugin(autoIncrement.plugin, {
  model: 'Tutor',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Tutor', TutorSchema, 'users');

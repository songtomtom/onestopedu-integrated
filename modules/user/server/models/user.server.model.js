/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: ''
  },
  mobile: {
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
    type: String
  },
  providers: {
    type: [{
      type: String
    }],
    trim: true
  },
  roles: {
    type: [{
      type: String
    }]
  },
  company: {
    type: String
  },
  languages: {
    type: [{
      type: String
    }]
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
UserSchema.pre('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

/**
 * Schema Compile
 */
mongoose.model('User', UserSchema);

/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const path = require('path');
const env = require(path.resolve('./config/env/default'));
const autoIncrement = require('mongoose-auto-increment-fix');

/**
 * Initialize auto increment
 */
autoIncrement.initialize(mongoose.connection);

/**
 * Coupon Schema
 */
const CouponSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  groupId: {
    type: mongoose.Schema.ObjectId
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Member'
  },
  publisher: {
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
    default: ''
  },
  code: {
    type: String,
    trim: true
  },
  generateCount: {
    type: Number
  },
  discountType: {
    type: String,
    enum: ['price', 'rate']
  },
  amount: {
    type: Number,
    default: 0
  },
  state: {
    type: String,
    enum: ['valid', 'inValid', 'used'],
    default: 'valid'
  },
  registed: {
    type: Date
  },
  expired: {
    type: Date
  },
  used: {
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
 * Hook a pre save method to generate guest username
 */
CouponSchema.pre('save', function(next) {
  if (this.providers && this.isModified('providers')) {
    this.code = this.generateCode();
  }
  next();
});

/**
 * Create instance method for hashing a code
 */
CouponSchema.methods.generateCode = function() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 16; i += 1) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
};

/**
 * Set virtual field nation code
 */
CouponSchema.virtual('displayAmount')
  .get(function() {
    return this.amount + ((this.discountType === 'rate') ? '%' : '') + ' | ' + this.title;
  });

/**
 * Virtual setting to josn parsing
 */
CouponSchema.set('toJSON', {
  virtuals: true
});

/**
 * Plug in auto increment
 */
CouponSchema.plugin(autoIncrement.plugin, {
  model: 'Coupon',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Coupon', CouponSchema, 'resources.coupons');

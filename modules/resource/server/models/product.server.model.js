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
 * Product Schema
 */
const ProductSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  providers: {
    type: [{
      type: String,
      enum: env.providers
    }],
    trim: true,
    required: 'Please you must select one provider'
  },

  productType: {
    type: String,
    enum: env.productType,
    required: 'Please you must select one product type'
  },

  curriculum: {
    type: String,
    enum: ['conversation', 'freeTalking', 'business', 'interview', 'examPreparation'],
    required: 'Please you must select one curriculum'
  },

  nation: {
    type: String,
    enum: ['bulgaria', 'philippines', 'northAmerica'],
    required: 'Please you must select one nation'
  },
  month: {
    type: Number,
    enum: [1, 3, 6, 12]
  },
  times: {
    type: Number,
    enum: [2, 3, 5]
  },
  minutes: {
    type: Number,
    enum: [10, 20]
  },

  lessonCount: {
    type: Number,
    default: 0
  },

  postponeCount: {
    type: Number,
    default: 0
  },


  /**
   * Earn point rate
   */
  earningPointRate: {
    type: Number,
    default: 0
  },

  /**
   * Discount price rate
   */
  discountPriceRate: {
    type: Number,
    default: 0
  },

  /**
   * Original price
   */
  price: {
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
 * Set virtual field sub price calculation
 */
ProductSchema.virtual('subPrice')
  .get(function() {
    return this.price * (1 - (this.discountPriceRate * 0.01));
  });

/**
 * Set virtual field sub earnning point
 */
ProductSchema.virtual('earnPoint')
  .get(function() {
    return this.price * (1 - (this.discountPriceRate * 0.01)) * (this.earningPointRate * 0.01);
  });

/**
 * Set virtual field nation code
 */
ProductSchema.virtual('nationCode')
  .get(function() {
    let nationCode;
    if (this.nation === 'bulgaria') {
      nationCode = 'BG';
    } else if (this.nation === 'philippines') {
      nationCode = 'PH';
    } else if (this.nation === 'china') {
      nationCode = 'CN';
    } else if (this.nation === 'northAmerica') {
      nationCode = 'US';
    }
    return nationCode;
  });

/**
 * Set virtual field title
 */
ProductSchema.virtual('title')
  .get(function() {
    let curriculum;
    let nation;
    let productType;

    if (this.curriculum === 'conversation') {
      curriculum = '정규회화';
    } else if (this.curriculum === 'freeTalking') {
      curriculum = '프리토킹';
    } else if (this.curriculum === 'business') {
      curriculum = '비즈니스';
    } else if (this.curriculum === 'interview') {
      curriculum = '인터뷰';
    } else if (this.curriculum === 'examPreparation') {
      curriculum = '시험대비';
    }

    if (this.productType === 'telephone') {
      productType = '전화';
    } else if (this.productType === 'skype') {
      productType = '스카이프';
    } else if (this.productType === 'screenBoard') {
      productType = '화상칠판';
    }

    if (this.nation === 'bulgaria') {
      nation = '유럽';
    } else if (this.nation === 'philippines') {
      nation = '필리핀';
    } else if (this.nation === 'northAmerica') {
      nation = '미주';
    }

    return `${productType} | ${curriculum} | ${nation} | ${this.month}개월 주${this.times}회 ${this.minutes}분`;
  });

/**
 * Virtual setting to josn parsing
 */
ProductSchema.set('toJSON', {
  virtuals: true
});

/**
 * Plug in auto increment
 */
ProductSchema.plugin(autoIncrement.plugin, {
  model: 'Product',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Schema Compile
 */
mongoose.model('Product', ProductSchema, 'resources.products');

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
 * File Item Item Schema
 */
const FileItemSchema = new mongoose.Schema({
  counters: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  // uploadType: {
  //   type: String,
  //   enum: ['attachment', 'record', 'summernote', 'eventBanner', 'textbook', 'profile']
  // },
  fieldname: {
    type: String
  },
  filename: {
    type: String
  },
  extension: {
    type: String
  },
  size: {
    type: Number,
    default: 0
  },
  mimetype: {
    type: String
  },
  originalname: {
    type: String
  },
  path: {
    type: String
  },
  destination: {
    type: String
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
 * Set virtual field display to font awesome class
 */
FileItemSchema.virtual('iconClass').get(function() {

  const extension = {
    image: ['jpg', 'png', 'jpeg', 'bmp', 'gif'],
    word: ['doc', 'docx'],
    powerpoint: ['ppt', 'pptx'],
    excel: ['xls', 'xlsx', 'xlsb'],
    pdf: ['pdf'],
    compression: ['zip']
  };

  if (extension.image.indexOf(this.extension) !== -1) {
    return 'fa-file-image';
  } else if (extension.word.indexOf(this.extension) !== -1) {
    return 'fa-file-word';
  } else if (extension.powerpoint.indexOf(this.extension) !== -1) {
    return 'fa-file-powerpoint';
  } else if (extension.excel.indexOf(this.extension) !== -1) {
    return 'fa-file-excel';
  } else if (extension.pdf.indexOf(this.extension) !== -1) {
    return 'fa-file-pdf';
  } else if (extension.compression.indexOf(this.extension) !== -1) {
    return 'fa-file-archive';
  } else {
    return 'fa-file-alt';
  }

});

/**
 * Plug in auto increment
 */
FileItemSchema.plugin(autoIncrement.plugin, {
  model: 'FileItem',
  field: 'counters',
  startAt: 1,
  incrementBy: 1,
  unique: false
});

/**
 * Virtual setting to josn parsing
 */
FileItemSchema.set('toJSON', {
  virtuals: true
});

/**
 * Schema Compile
 */
mongoose.model('FileItem', FileItemSchema, 'resources.fileitems');

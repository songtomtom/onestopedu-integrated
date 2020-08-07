/**
 * Module Dependencies
 */
const _ = require('lodash');

/**
 * Image files filter
 */
exports.imageFileFilter = function(req, file, callback) {
  const mimetype = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif'
  ];

  if (!_.includes(mimetype, file.mimetype)) {
    return callback(new Error('Only image files are allowed!'), false);
  }

  callback(null, true);
};

/**
 * Audio files filter
 */
exports.audioFileFilter = function(req, file, callback) {
  const mimetype = [
    'audio/mpeg3',
    'audio/x-mpeg-3',
    'video/mpeg',
    'video/x-mpeg'
  ];

  if (!_.includes(mimetype, file.mimetype)) {
    return callback(new Error('Only audio files are allowed!'), false);
  }

  callback(null, true);
};

/**
 * Attach files filter
 */
exports.attachFileFilter = function(req, file, callback) {
  const mimetype = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif'
  ];

  if (!_.includes(mimetype, file.mimetype)) {
    return callback(new Error('Only attach files are allowed!'), false);
  }

  callback(null, true);
};

/**
 * Textbook files filter
 */
exports.textbookFileFilter = function(req, file, callback) {
  const mimetype = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!_.includes(mimetype, file.mimetype)) {
    return callback(new Error('Only document files are allowed!'), false);
  }

  callback(null, true);
};

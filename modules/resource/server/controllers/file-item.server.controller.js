/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const config = require(path.resolve('./config/config'));
const fs = require('fs');
const multer = require('multer');
const moment = require('moment');
const multerFilter = require(path.resolve('./config/lib/multer'));
const FileItem = mongoose.model('FileItem');

/**
 * Upload fileItems
 */
exports.upload = function(req, res, next) {
  const storage = multer.diskStorage({
    destination: function(req, fileItem, callback) {
      const dir = config.uploads.dest + moment().format('YYYYMMDD');

      if (!fs.existsSync(dir)) {
        return fs.mkdir(dir, (err) => {
          return callback(err, dir);
        });
      } else {
        return callback(null, dir);
      }
    }
  });

  const upload = multer({
    storage
  }).single('newFileItem');

  // Filtering to upload only attaches
  upload.fileFilter = multerFilter[req.body.filterName];

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send({
        message: 'Error occurred while uploading fileItems'
      });
    }
    res.json(req.file);
  });
};

/**
 * Create an FileItem test
 */
exports.create = function(req, res) {
  const fileItem = new FileItem(req.body);
  const isLinuxPath = fileItem.path.indexOf('\\') !== -1;
  const pathEdit = isLinuxPath ? 'public\\' : 'public/';

  fileItem.path = fileItem.path.replace(pathEdit, '');
  fileItem.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fileItem);
    }
  });
};

/**
 * Show the current fileItem information
 */
exports.read = function(req, res) {
  const fileItem = req.fileItem ?
    req.fileItem.toJSON() : {};
  res.json(fileItem);
};

/**
 * Delete an FileItem
 */
exports.remove = function(req, res) {
  const fileItem = req.fileItem;

  fileItem.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      try {
        if (fs.existsSync(fileItem.path)) {
          fs.unlinkSync(fileItem.path);
        }
      } catch (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.json(fileItem);
    }
  });
};

/**
 * Delete an many FileItems
 */
exports.removeMany = function(req, res) {

  if (req.body.removeFileItems.length <= 0) {
    return res.status(404).send({
      message: 'Not exist to remove fileItem array'
    });
  }

  const removeFileItemIds = req.body.removeFileItems.map((fileItemItem) => {
    return fileItemItem._id;
  });

  FileItem.remove({
      _id: {
        $in: removeFileItemIds
      }
    })
    .exec((err, response) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        req.body.removeFileItems.forEach((removeFileItemItem) => {
          try {
            if (fs.existsSync(removeFileItemItem.path)) {
              fs.unlinkSync(removeFileItemItem.path);
            }
          } catch (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
        });
        res.json(response);
      }
    });
};

/**
 * List of FileItem resource
 */
exports.list = function list(req, res) {

  FileItem.find()
    .sort('-created')
    .exec((err, fileItems) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(fileItems);
      }
    });
};

/**
 * FileItem resource middleware
 */
exports.fileItemById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'FileItem resource is invalid'
    });
  }

  FileItem.findById(id)
    .populate('user')
    .exec((err, fileItem) => {
      if (err) {
        return next(err);
      } else if (!fileItem) {
        return res.status(404).send({
          message: 'No file item resource with that identifier has been found'
        });
      }
      req.fileItem = fileItem;
      next();
    });
};

/**
 * Download
 */
exports.download = function(req, res) {
  const fileItem = req.fileItem;

  res.setHeader('Content-Disposition', 'attactment; filename=', fileItem.originalname);
  res.writeHead(200, {
    'Content-Type': fileItem.mimetype
  });

  const file = fs.createReadStream(path.resolve('public', fileItem.path));
  file.pipe(res);
};

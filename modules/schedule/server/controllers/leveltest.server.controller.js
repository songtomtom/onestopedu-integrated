/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Leveltest = mongoose.model('Leveltest');

/**
 * Create an Leveltest
 */
exports.save = function(req, res) {
  const leveltest = new Leveltest(req.body);
  leveltest.assessment = req.assessment._id;
  leveltest.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(leveltest);
  });
};

/**
 * Show the current Leveltest
 */
exports.read = function(req, res) {
  const leveltest = req.leveltest ? req.leveltest.toJSON() : {};
  res.json(leveltest);
};

/**
 * Update an Leveltest
 */
exports.update = function(req, res) {
  const leveltest = _.extend(req.leveltest, req.body);
  leveltest.updated = Date.now();
  leveltest.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(leveltest);
    }
  });
};

/**
 * Delete an Leveltest
 */
exports.remove = function(req, res) {
  const leveltest = req.leveltest;

  leveltest.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(leveltest);
    }
  });
};

/**
 * List of leveltest by user id
 */
exports.userByList = function(req, res) {

  const user = req.profile;

  Leveltest.find({
      user: user._id,
      scheduleType: 'leveltest'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutor',
      select: '-password -salt'
    })
    .sort('-created')
    .exec((err, leveltests) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(leveltests);
      }
    });
};

/**
 * List of Leveltests
 */
exports.list = function(req, res) {

  const user = req.user;

  Leveltest.find({
      providers: {
        $in: user.providers
      },
      scheduleType: 'leveltest'
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutor',
      select: '-password -salt'
    })
    .sort('-created')
    .exec((err, leveltests) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(leveltests);
      }
    });
};


/**
 * Leveltest middleware
 */
exports.leveltestById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'leveltest is invalid'
    });
  }

  Leveltest.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'tutor',
      select: '-password -salt'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username nickName roles created profileImage'
      }
    })
    .populate('assessment')
    .exec((err, leveltest) => {
      if (err) {
        return next(err);
      } else if (!leveltest) {
        return res.status(404).send({
          message: 'No Leveltest with that identifier has been found'
        });
      }
      req.leveltest = leveltest;
      next();
    });
};

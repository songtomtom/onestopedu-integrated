/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const ContactUs = mongoose.model('ContactUs');


/**
 * Create an Contact Us
 */
exports.create = function(req, res) {

  const contactUs = new ContactUs(req.body);

  contactUs.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contactUs);
    }
  });
};

/**
 * Show the current Contact Us
 */
exports.read = function(req, res) {

  const contactUs = req.contactUs ? req.contactUs.toJSON() : {};
  res.json(contactUs);
};

/**
 * Update an Contact Us
 */
exports.update = function(req, res) {

  const contactUs = _.extend(req.contactUs, req.body);

  contactUs.updated = Date.now();
  contactUs.save((err) => {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(contactUs);
    }
  });
};

/**
 * Delete an Contact Us
 */
exports.remove = function(req, res) {
  const contactUs = req.contactUs;

  contactUs.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(contactUs);
    }
  });
};

/**
 * List of Contact Uss
 */
exports.list = function(req, res) {

  const user = req.user;

  ContactUs.find({
      category: 'contactUs',
      providers: {
        $in: user.providers
      }
    })
    .sort('-type -counters')
    .populate('attachmentFiles')
    .populate({
      path: 'user',
      select: 'username koreanName englishName nickName profileImage'
    })
    .exec((err, contactUses) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(contactUses);
      }
    });
};

/**
 * Contact Us middleware
 */
exports.contactUsById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'contact us is invalid'
    });
  }

  ContactUs.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username nickName roles created profileImage'
      }
    })
    .populate('attachmentFiles')
    .exec((err, contactUs) => {
      if (err) {
        return next(err);
      } else if (!contactUs) {
        return res.status(404).send({
          message: 'No contact us with that identifier has been found'
        });
      }
      req.contactUs = contactUs;
      next();
    });
};

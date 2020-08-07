/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Coupon = mongoose.model('Coupon');

/**
 * Create an coupon
 */
exports.create = function(req, res) {
  const groupId = mongoose.Types.ObjectId();
  const generateCount = req.body.generateCount;
  const docs = [];
  req.body.groupId = groupId;

  for (let i = 0; i < generateCount; i += 1) {
    docs[i] = req.body;
  }

  Coupon.create(docs, (err, coupons) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coupons);
    }
  });
};

/**
 * Show the current coupon
 */
exports.read = function(req, res) {
  const coupon = req.coupon ? req.coupon.toJSON() : {};
  res.json(coupon);
};

/**
 * Update an coupon
 */
exports.update = function(req, res) {
  const coupon = _.extend(req.coupon, req.body);
  coupon.updated = Date.now();
  coupon.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(coupon);
    }
  });
};

/**
 * Remove an Point
 */
exports.delete = function(req, res) {
  const coupon = req.coupon;

  coupon.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(coupon);
    }
  });
};

/**
 * Delete an coupon next member
 */
exports.remove = function(req, res, next) {
  const coupon = req.coupon;

  if (coupon.state === 'used') {
    return res.status(400).send({
      message: 'Coupon is used'
    });
  }

  coupon.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!req.member) {
      /** This is the username that exists in this provider */
      return res.status(404).send({
        message: 'This is the member name that exists in this provider.'
      });
    } else {
      req.coupon = coupon;
      next();
    }
  });
};

/**
 * Add coupon to member
 */
exports.save = function(req, res, next) {
  const coupon = req.coupon;
  coupon.user = req.member._id;
  coupon.registed = Date.now();
  coupon.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!req.member) {
      // This is the membername that exists in this provider.
      return res.status(404).send({
        message: 'This is the member name that exists in this provider.'
      });
    } else {
      req.coupon = coupon;
      next();
    }
  });
};

/**
 * List of coupon
 */
exports.list = function(req, res) {
  Coupon.find()
    .sort('-counters')
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'publisher',
      select: '-password -salt'
    })
    .exec((err, coupons) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(coupons);
      }
    });
};

/**
 * List of coupon group
 */
exports.listByGroupId = function(req, res) {
  Coupon.find({
      groupId: req.params.groupId
    })
    .sort('-counters')
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'publisher',
      select: '-password -salt'
    })
    .exec((err, coupons) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(coupons);
      }
    });
};

/**
 * List of coupon code
 */
exports.readByCode = function(req, res) {
  Coupon.findOne({
      code: req.params.code
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'publisher',
      select: '-password -salt'
    })
    .exec((err, coupons) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(coupons);
      }
    });
};


/**
 * List of coupons
 */
exports.listByMemberId = function(req, res) {
  const member = req.member;
  Coupon.find({
      user: member._id
    })
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .sort('-created')
    .exec((err, payments) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(payments);
      }
    });
};

/**
 * Coupon middleware
 */
exports.couponById = function couponById(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Coupon is invalid'
    });
  }

  Coupon.findById(id)
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .populate({
      path: 'publisher',
      select: '-password -salt'
    })
    .exec((err, coupon) => {
      if (err) {
        return next(err);
      } else if (!coupon) {
        return res.status(404).send({
          message: 'No Coupon with that identifier has been found'
        });
      }
      req.coupon = coupon;
      next();
    });
};

/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const Member = mongoose.model('Member');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Sign up an member
 */
exports.signup = function(req, res) {

  // Init member and add missing fields
  const member = new Member(req.body);
  Member.findUniqueUsername(member, (err, member) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (!member) {
      // This is the membername that exists in this provider.
      return res.status(422).send({
        message: 'This is the member name that exists in this provider.'
      });
    } else {
      // Then save the member
      member.save((err) => {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // Remove sensitive data before login
          member.password = undefined;
          member.salt = undefined;
          res.json(member);
        }
      });
    }
  });
};

/**
 * Show the current member
 */
exports.read = function(req, res) {
  const member = req.member ? req.member.toJSON() : {};
  res.json(req.member);
};

/**
 * Add point at member
 */
exports.savePoint = function(req, res) {
  const point = req.point;
  const member = req.member;
  member.point += point.amount;
  member.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(point);
    }
  });
};

/**
 * Add coupon at member
 */
exports.saveCoupon = function(req, res) {
  const coupon = req.coupon;
  const member = req.member;
  member.coupons.push(coupon._id);
  member.save((err) => {
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
 * Remove coupon at member
 */
exports.removeCoupon = function(req, res) {
  const coupon = req.coupon;
  const member = req.member;
  member.coupons = member.coupons
    .filter((_coupon) => {
      return _coupon._id !== coupon._id;
    })
    .map((_coupon) => {
      return _coupon._id;
    });

  member.save((err) => {
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
 * Update an member
 */
exports.update = function(req, res) {

  const member = _.extend(req.member, req.body);
  member.updated = Date.now();
  member.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(member);
    }
  });
};


/**
 * Delete an member
 */
exports.remove = function(req, res) {
  const member = req.member;

  member.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.json(member);
    }
  });
};

/**
 * List of members for providers
 */
exports.providersByList = function(req, res) {

  const providers = (_.isArray(req.params.providers)) ?
    req.params.providers : [req.params.providers];
  Member.find({
      providers: {
        $in: providers
      },
      roles: ['member']
    })
    .select('-password -salt')
    .sort('-created')
    .populate({
      path: 'coupons',
      match: {
        state: 'valid'
      }
    })
    .exec((err, members) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(members);
      }
    });
};

/**
 * List of members
 */
exports.list = function(req, res) {
  const user = req.user;
  Member.find({
      providers: {
        $in: user.providers
      },
      roles: ['member']
    })
    .select('-password -salt')
    .sort('-counters')
    .exec((err, members) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(members);
      }
    });
};

/**
 * List of members
 */
exports.holdByList = function(req, res) {

  const user = req.user;

  const Payment = mongoose.model('Payment');

  Payment.aggregate([{
      $match: {
        providers: {
          $in: (Array.isArray(user.providers)) ? user.providers : new Array(user.providers)
        },
        category: 'payment',
        state: 'hold'
      }
    }, {
      $group: {
        _id: {
          user: '$user'
        }
      }
    }])
    .exec((err, memberIds) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        const _ids = memberIds.map((memberId) => {
          return _ids.push(memberId._id.user);
        });

        Member.find({
            _id: {
              $in: _ids
            },
            roles: ['member']
          })
          .sort('-created')
          .exec((err, members) => {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.json(members);
            }
          });
      }
    });
};

/**
 * Member middleware
 */
exports.memberById = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'member is invalid'
    });
  }

  Member.findById(id)
    .select('-password -salt')
    .populate({
      path: 'coupons',
      match: {
        state: 'valid'
      }
    })
    .exec((err, member) => {
      if (err) {
        return next(err);
      } else if (!member) {
        return res.status(404).send({
          message: 'No member with that identifier has been found'
        });
      }
      req.member = member;
      next();
    });
};

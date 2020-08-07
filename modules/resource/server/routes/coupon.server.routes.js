/**
 * Module Dependencies
 */
const coupon = require('../controllers/coupon.server.controller');
const member = require('../../../user/server/controllers/member.server.controller.js');
const couponPolicy = require('../policies/coupon.server.policy');

/**
 * Coupon route configuration
 */
module.exports = function(app) {
  app.route('/api/coupon')
    .get(couponPolicy.isAllowed, coupon.list)
    .post(couponPolicy.isAllowed, coupon.create);

  app.route('/api/coupon/:couponId')
    .get(couponPolicy.isAllowed, coupon.read)
    .put(couponPolicy.isAllowed, coupon.update)
    .delete(couponPolicy.isAllowed, coupon.delete);

  app.route('/api/coupon/group/:groupId')
    .get(couponPolicy.isAllowed, coupon.listByGroupId);

  app.route('/api/coupon/member/:memberId')
    .get(couponPolicy.isAllowed, coupon.listByMemberId);

  app.route('/api/coupon/:couponId/member/:memberId')
    .get(couponPolicy.isAllowed, coupon.save, member.saveCoupon)
    .delete(couponPolicy.isAllowed, coupon.remove, member.removeCoupon);

  app.route('/api/coupon/code/:code')
    .get(couponPolicy.isAllowed, coupon.readByCode);

  app.param('couponId', coupon.couponById);
};

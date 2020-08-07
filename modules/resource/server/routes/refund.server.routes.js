/**
 * Module Dependencies
 */
const refund = require('../controllers/refund.server.controller');
const refundPolicy = require('../policies/refund.server.policy');

/**
 * Refund route configuration
 */
module.exports = function(app) {

  /**
   * Refund collection routes
   */
  app.route('/api/refund')
    .get(refundPolicy.isAllowed, refund.list)
    .post(refundPolicy.isAllowed, refund.create);

  /**
   * Single Refund routes
   */
  app.route('/api/refund/:refundId')
    .get(refundPolicy.isAllowed, refund.read)
    .put(refundPolicy.isAllowed, refund.update)
    .delete(refundPolicy.isAllowed, refund.remove);

  app.route('/api/refund/member/:memberId')
    .get(refundPolicy.isAllowed, refund.listByMemberId);

  /**
   * Finish by binding the Refund middleware
   */
  app.param('refundId', refund.refundById);
  // app.param('memberId', refund.memberById);
};

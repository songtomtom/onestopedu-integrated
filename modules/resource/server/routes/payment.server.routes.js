/**
 * Module Dependencies
 */
const payment = require('../controllers/payment.server.controller');
const paymentPolicy = require('../policies/payment.server.policy');

/**
 * Payment route configuration
 */
module.exports = function(app) {

  /**
   * Payment collection routes
   */
  app.route('/api/payment')
    .get(paymentPolicy.isAllowed, payment.list)
    .post(paymentPolicy.isAllowed, payment.create);

  /**
   * Single Payment routes
   */
  app.route('/api/payment/:paymentId')
    .get(paymentPolicy.isAllowed, payment.read)
    .put(paymentPolicy.isAllowed, payment.update)
    .delete(paymentPolicy.isAllowed, payment.remove);

  app.route('/api/payment/member/:memberId')
    .get(paymentPolicy.isAllowed, payment.listByMemberId);

  /**
   * Finish by binding the Payment middleware
   */
  app.param('paymentId', payment.paymentById);
  // app.param('memberId', payment.memberById);
};

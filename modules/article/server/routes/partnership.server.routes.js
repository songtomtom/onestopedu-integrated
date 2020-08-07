/**
 * Module Dependencies
 */
const partnershipPolicy = require('../policies/partnership.server.policy');
const partnership = require('../controllers/partnership.server.controller');

/**
 * Partnership route configuration
 */
module.exports = function(app) {

  /**
   * Partnership collection routes
   */
  app.route('/api/partnership')
    .get(partnershipPolicy.isAllowed, partnership.list)
    .post(partnershipPolicy.isAllowed, partnership.create);

  /**
   * Single partnership routes
   */
  app.route('/api/partnership/:partnershipId')
    .get(partnershipPolicy.isAllowed, partnership.read)
    .put(partnershipPolicy.isAllowed, partnership.update)
    .delete(partnershipPolicy.isAllowed, partnership.remove);

  /**
   * Finish by binding the partnership middleware
   */
  app.param('partnershipId', partnership.partnershipById);
};

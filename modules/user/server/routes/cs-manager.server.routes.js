/**
 * Module Dependencies
 */
const csManagerPolicy = require('../policies/cs-manager.server.policy');
const csManager = require('../controllers/cs-manager.server.controller');

/**
 * Customer service manager route configuration
 */
module.exports = function(app) {

  /**
   * Customer service manager collection routes
   */
  app.route('/api/cs-manager')
    .get(csManagerPolicy.isAllowed, csManager.list)
    .post(csManagerPolicy.isAllowed, csManager.signup);

  /**
   * Single customer service manager routes
   */
  app.route('/api/cs-manager/:csManagerId')
    .put(csManagerPolicy.isAllowed, csManager.update)
    .get(csManagerPolicy.isAllowed, csManager.read);

  /**
   * Finish by binding the customer service manager middleware
   */
  app.param('csManagerId', csManager.csManagerById);
};

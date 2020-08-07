/**
 * Module Dependencies
 */
const adminPolicy = require('../policies/admin.server.policy');
const admin = require('../controllers/admin.server.controller');

/**
 * Admin route configuration
 */
module.exports = function routeConfig(app) {

  /**
   * Admin collection routes
   */
  app.route('/api/admin')
    .get(adminPolicy.isAllowed, admin.list)
    .post(adminPolicy.isAllowed, admin.signup);

  /**
   * Single admin routes
   */
  app.route('/api/admin/:adminId')
    .put(adminPolicy.isAllowed, admin.update)
    .get(adminPolicy.isAllowed, admin.read);

  /**
   * Finish by binding the admin middleware
   */
  app.param('adminId', admin.adminById);
};

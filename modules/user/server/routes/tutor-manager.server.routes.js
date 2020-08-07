/**
 * Module Dependencies
 */
const tutorManagerPolicy = require('../policies/tutor-manager.server.policy');
const tutorManager = require('../controllers/tutor-manager.server.controller');

/**
 * Tutor manager route configuration
 */
module.exports = function(app) {

  /**
   * Tutor manager collection routes
   */
  app.route('/api/tutor-manager')
    .get(tutorManagerPolicy.isAllowed, tutorManager.list)
    .post(tutorManagerPolicy.isAllowed, tutorManager.signup);

  /**
   * Single tutor manager routes
   */
  app.route('/api/tutor-manager/:tutorManagerId')
    .put(tutorManagerPolicy.isAllowed, tutorManager.update)
    .get(tutorManagerPolicy.isAllowed, tutorManager.read);

  /**
   * Finish by binding the tutor manager middleware
   */
  app.param('tutorManagerId', tutorManager.tutorManagerById);
};

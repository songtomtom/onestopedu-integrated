/**
 * Module Dependencies
 */
const tutorPolicy = require('../policies/tutor.server.policy');
const tutor = require('../controllers/tutor.server.controller');

/**
 * Tutor route configuration
 */
module.exports = function(app) {

  /**
   * Tutor collection routes
   */
  app.route('/api/tutor')
    .get(tutorPolicy.isAllowed, tutor.list)
    .post(tutorPolicy.isAllowed, tutor.signup);

  /**
   * Single tutor routes
   */
  app.route('/api/tutor/:tutorId')
    .get(tutorPolicy.isAllowed, tutor.read)
    .put(tutorPolicy.isAllowed, tutor.update)
    .delete(tutorPolicy.isAllowed, tutor.remove);

  app.route('/api/tutor/nation')
    .post(tutorPolicy.isAllowed, tutor.nationByList);

  app.route('/api/tutor/tutors')
    .post(tutorPolicy.isAllowed, tutor.tutorsByList);

  /**
   * Finish by binding the tutor middleware
   */
  app.param('tutorId', tutor.tutorById);
};

/**
 * Module Dependencies
 */
const assessment = require('../controllers/assessment.server.controller');
const assessmentPolicy = require('../policies/assessment.server.policy');

/**
 * Assessment route configuration
 */
module.exports = function(app) {

  /** Assessment collection routes */
  app.route('/api/assessment')
    .get(assessmentPolicy.isAllowed, assessment.list)
    .post(assessmentPolicy.isAllowed, assessment.save);

  /** Single Assessment routes */
  app.route('/api/assessment/:assessmentId')
    .get(assessmentPolicy.isAllowed, assessment.read)
    .put(assessmentPolicy.isAllowed, assessment.update)
    .delete(assessmentPolicy.isAllowed, assessment.remove);

  /** Finish by binding the Assessment middleware */
  app.param('assessmentId', assessment.assessmentById);
};

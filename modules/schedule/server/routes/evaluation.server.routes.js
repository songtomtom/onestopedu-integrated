/**
 * Module Dependencies
 */
const evaluation = require('../controllers/evaluation.server.controller');
const evaluationPolicy = require('../policies/evaluation.server.policy');

/**
 * Evaluation route configuration
 */
module.exports = function(app) {

  /** Evaluation collection routes */
  app.route('/api/evaluation')
    .get(evaluationPolicy.isAllowed, evaluation.list)
    .post(evaluationPolicy.isAllowed, evaluation.save);

  /** Single Evaluation routes */
  app.route('/api/evaluation/:evaluationId')
    .get(evaluationPolicy.isAllowed, evaluation.read)
    .put(evaluationPolicy.isAllowed, evaluation.update)
    .delete(evaluationPolicy.isAllowed, evaluation.remove);

  /** Finish by binding the Evaluation middleware */
  app.param('evaluationId', evaluation.evaluationById);
};

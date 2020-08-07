/**
 * Module Dependencies
 */
const feedback = require('../controllers/feedback.server.controller');
const feedbackPolicy = require('../policies/feedback.server.policy');

/**
 * Feedback route configuration
 */
module.exports = function(app) {

  /** Feedback collection routes */
  app.route('/api/feedback')
    .get(feedbackPolicy.isAllowed, feedback.list)
    .post(feedbackPolicy.isAllowed, feedback.save);

  /** Single Feedback routes */
  app.route('/api/feedback/:feedbackId')
    .get(feedbackPolicy.isAllowed, feedback.read)
    .put(feedbackPolicy.isAllowed, feedback.update)
    .delete(feedbackPolicy.isAllowed, feedback.remove);

  /** Finish by binding the Feedback middleware */
  app.param('feedbackId', feedback.feedbackById);
};

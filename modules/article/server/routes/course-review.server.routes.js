/**
 * Module Dependencies
 */
const courseReviewPolicy = require('../policies/course-review.server.policy');
const courseReview = require('../controllers/course-review.server.controller');

/**
 * Product review route configuration
 */
module.exports = function(app) {

  /**
   * Product review collection routes
   */
  app.route('/api/course-review')
    .get(courseReviewPolicy.isAllowed, courseReview.list)
    .post(courseReviewPolicy.isAllowed, courseReview.create);

  /**
   * Single product review routes
   */
  app.route('/api/course-review/:courseReviewId')
    .get(courseReviewPolicy.isAllowed, courseReview.read)
    .put(courseReviewPolicy.isAllowed, courseReview.update)
    .delete(courseReviewPolicy.isAllowed, courseReview.remove);

  /**
   * Finish by binding the product review middleware
   */
  app.param('courseReviewId', courseReview.courseReviewById);
};

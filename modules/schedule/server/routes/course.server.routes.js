/**
 * Module Dependencies
 */
const course = require('../controllers/course.server.controller');
const coursePolicy = require('../policies/course.server.policy');

/**
 * Course route configuration
 */
module.exports = function(app) {

  /** Course collection routes */
  app.route('/api/course')
    .get(coursePolicy.isAllowed, course.list)
    .post(coursePolicy.isAllowed, course.save);

  /** Single Course routes */
  app.route('/api/course/:courseId')
    .get(coursePolicy.isAllowed, course.read)
    .put(coursePolicy.isAllowed, course.update)
    .delete(coursePolicy.isAllowed, course.remove);

  app.route('/api/course/member/:memberId')
    .get(coursePolicy.isAllowed, course.listByMemberId);

  /** Finish by binding the Course middleware */
  app.param('courseId', course.courseById);
};

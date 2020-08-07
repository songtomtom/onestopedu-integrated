/**
 * Module Dependencies
 */
const lesson = require('../controllers/lesson.server.controller');
const feedback = require('../controllers/feedback.server.controller');
const lessonPolicy = require('../policies/lesson.server.policy');

/**
 * Lesson route configuration
 */
module.exports = function(app) {

  /** Lesson collection routes */
  app.route('/api/lesson')
    .get(lessonPolicy.isAllowed, lesson.list)
    .post(lessonPolicy.isAllowed, feedback.save, lesson.save);

  /** Single Lesson routes */
  app.route('/api/lesson/:lessonId')
    .get(lessonPolicy.isAllowed, lesson.read)
    .put(lessonPolicy.isAllowed, lesson.update)
    .delete(lessonPolicy.isAllowed, lesson.remove);

  app.route('/api/lesson/next/:lessonId')
    .get(lessonPolicy.isAllowed, lesson.next);
  app.route('/api/lesson/previous/:lessonId')
    .get(lessonPolicy.isAllowed, lesson.previous);
  app.route('/api/lesson/recent/:memberId')
    .get(lessonPolicy.isAllowed, lesson.recent);

  app.route('/api/lesson/course')
    .post(lessonPolicy.isAllowed, feedback.create, lesson.create);
  app.route('/api/lesson/course/:courseId')
    .get(lessonPolicy.isAllowed, lesson.listByCourseId);
  // .delete(lessonPolicy.isAllowed, lesson.delete);

  app.route('/api/lesson/course/:courseId/:state')
    .post(lessonPolicy.isAllowed, lesson.delete, feedback.create, lesson.create);

  app.route('/api/lesson/postpone/:lessonId')
    .post(lessonPolicy.isAllowed, feedback.save, lesson.postpone);
  app.route('/api/lesson/revert/:lessonId')
    .get(lessonPolicy.isAllowed, lesson.revert);
  app.route('/api/lesson/hold/:lessonId')
    .get(lessonPolicy.isAllowed, lesson.hold);
  app.route('/api/lesson/un-hold/:courseId')
    .get(lessonPolicy.isAllowed, lesson.unHold);

  app.route('/api/lesson/member/:memberId')
    .get(lessonPolicy.isAllowed, lesson.listByMemberId);

  app.route('/api/lesson/date')
    .post(lessonPolicy.isAllowed, lesson.dateByList);

  /** Finish by binding the Lesson middleware */
  app.param('lessonId', lesson.lessonById);
};

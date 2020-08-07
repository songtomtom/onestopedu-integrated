/**
 * Module Dependencies
 */
const noticePolicy = require('../policies/notice.server.policy');
const notice = require('../controllers/notice.server.controller');

/**
 * Notice route configuration
 */
module.exports = function(app) {

  /**
   * Notice collection routes
   */
  app.route('/api/notice')
    .get(noticePolicy.isAllowed, notice.list)
    .post(noticePolicy.isAllowed, notice.create);

  /**
   * Single notice routes
   */
  app.route('/api/notice/:noticeId')
    .get(noticePolicy.isAllowed, notice.read)
    .put(noticePolicy.isAllowed, notice.update)
    .delete(noticePolicy.isAllowed, notice.remove);

  /**
   * Finish by binding the notice middleware
   */
  app.param('noticeId', notice.noticeById);
};

/**
 * Module Dependencies
 */
const monthly = require('../controllers/monthly.server.controller');
const evaluation = require('../controllers/evaluation.server.controller');
const monthlyPolicy = require('../policies/monthly.server.policy');

/**
 * Monthly route configuration
 */
module.exports = function(app) {

  /** Monthly collection routes */
  app.route('/api/monthly')
    .get(monthlyPolicy.isAllowed, monthly.list)
    .post(monthlyPolicy.isAllowed, evaluation.save, monthly.save);

  /** Single Monthly routes */
  app.route('/api/monthly/:monthlyId')
    .get(monthlyPolicy.isAllowed, monthly.read)
    .put(monthlyPolicy.isAllowed, monthly.update)
    .delete(monthlyPolicy.isAllowed, monthly.remove);

  app.route('/api/monthly/course')
    .post(monthlyPolicy.isAllowed, evaluation.create, monthly.create);

  app.route('/api/monthly/course/:courseId')
    .get(monthlyPolicy.isAllowed, monthly.listByCourseId);

  app.route('/api/monthly/member/:memberId')
    .get(monthlyPolicy.isAllowed, monthly.listByMemberId);

  app.route('/api/monthly/month/:month')
    .get(monthlyPolicy.isAllowed, monthly.monthByList);

  /** Finish by binding the Monthly middleware */
  app.param('monthlyId', monthly.monthlyById);
};

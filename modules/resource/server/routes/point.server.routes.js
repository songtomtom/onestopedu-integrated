/**
 * Module Dependencies
 */
const point = require('../controllers/point.server.controller');
const member = require('../../../user/server/controllers/member.server.controller.js');
const pointPolicy = require('../policies/point.server.policy');

/**
 * Module Exports
 */
module.exports = function(app) {
  // Point collection routes
  app.route('/api/point')
    .get(pointPolicy.isAllowed, point.list);

  // Single Point routes
  app.route('/api/point/:pointId')
    .get(pointPolicy.isAllowed, point.read)
    .put(pointPolicy.isAllowed, point.update)
    .delete(pointPolicy.isAllowed, point.remove);

  app.route('/api/point/member/:memberId')
    .get(pointPolicy.isAllowed, point.listByMemberId)
    .post(pointPolicy.isAllowed, point.save, member.savePoint);

  // Finish by binding the Point middleware
  app.param('pointId', point.pointById);
};

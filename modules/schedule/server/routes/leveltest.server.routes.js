/**
 * Module Dependencies
 */
const leveltest = require('../controllers/leveltest.server.controller');
const assessment = require('../controllers/assessment.server.controller');
const leveltestPolicy = require('../policies/leveltest.server.policy');

/**
 * Leveltest route configuration
 */
module.exports = function(app) {
  // Leveltest collection routes
  app.route('/api/leveltest')
    .get(leveltestPolicy.isAllowed, leveltest.list)
    .post(leveltestPolicy.isAllowed, assessment.save, leveltest.save);

  app.route('/api/leveltest/user/:userId')
    .get(leveltestPolicy.isAllowed, leveltest.userByList);

  // Single Leveltest routes
  app.route('/api/leveltest/:leveltestId')
    .get(leveltestPolicy.isAllowed, leveltest.read)
    .put(leveltestPolicy.isAllowed, leveltest.update)
    .delete(leveltestPolicy.isAllowed, leveltest.remove);

  // Finish by binding the Leveltest middleware
  app.param('leveltestId', leveltest.leveltestById);
};

/**
 * Module Dependencies
 */
const hold = require('../controllers/hold.server.controller');
const holdPolicy = require('../policies/hold.server.policy');

/**
 * Hold route configuration
 */
module.exports = function(app) {

  /** Hold collection routes */
  app.route('/api/hold')
    .get(holdPolicy.isAllowed, hold.list)
    .post(holdPolicy.isAllowed, hold.save);

  /** Single Hold routes */
  app.route('/api/hold/:holdId')
    .get(holdPolicy.isAllowed, hold.read)
    .put(holdPolicy.isAllowed, hold.update)
    .delete(holdPolicy.isAllowed, hold.remove);

  app.route('/api/hold/count')
    .post(holdPolicy.isAllowed, hold.count);

  /** Finish by binding the Hold middleware */
  app.param('holdId', hold.holdById);
};

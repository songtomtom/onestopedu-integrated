/**
 * Module Dependencies
 */
const memberPolicy = require('../policies/member.server.policy');
const member = require('../controllers/member.server.controller');

/**
 * Member route configuration
 */
module.exports = function(app) {
  // Member collection routes
  app.route('/api/member')
    .get(memberPolicy.isAllowed, member.list)
    .post(memberPolicy.isAllowed, member.signup);
  // Single member routes
  app.route('/api/member/:memberId')
    .get(memberPolicy.isAllowed, member.read)
    .put(memberPolicy.isAllowed, member.update)
    .delete(memberPolicy.isAllowed, member.remove);
  app.route('/api/member/providers/:providers')
    .get(memberPolicy.isAllowed, member.providersByList);
  app.route('/api/member/state/hold')
    .post(memberPolicy.isAllowed, member.holdByList);
  // Finish by binding the member middleware
  app.param('memberId', member.memberById);
};

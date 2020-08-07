/**
 * Module Dependencies
 */
const userPolicy = require('../policies/user.server.policy');
const user = require('../controllers/user.server.controller');

/**
 * User route configuration
 */
module.exports = function(app) {

  /**
   * Setting up the users profile api
   */
  app.route('/api/user/me')
    .get(userPolicy.isAllowed, user.me);
  app.route('/api/user/:userId')
    .get(userPolicy.isAllowed, user.read);
  app.route('/api/user')
    .put(userPolicy.isAllowed, user.update);
  app.route('/api/user/password')
    .post(userPolicy.isAllowed, user.changePassword);
  app.route('/api/user/picture')
    .post(userPolicy.isAllowed, user.changeProfilePicture);

  /**
   * Finish by binding the user middleware
   */
  app.param('userId', user.userById);
};

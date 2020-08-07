/**
 * Module Dependencies
 */
const user = require('../controllers/user.server.controller');

/**
 * Auth route configuration
 */
module.exports = function(app) {

  /**
   * Setting up the auths authentication api
   */
  app.route('/api/auth/signin').post(user.signin);
  app.route('/api/auth/signout').get(user.signout);

};

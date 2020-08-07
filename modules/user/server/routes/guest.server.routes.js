/**
 * Module Dependencies
 */
const guestPolicy = require('../policies/guest.server.policy');
const guest = require('../controllers/guest.server.controller');

/**
 * Guest route configuration
 */
module.exports = function(app) {

  // Guest collection routes
  app.route('/api/guest')
    .post(guestPolicy.isAllowed, guest.signup)
    .get(guestPolicy.isAllowed, guest.list);

  // Single guest routes
  app.route('/api/guest/:guestId')
    .get(guestPolicy.isAllowed, guest.read)
    .put(guestPolicy.isAllowed, guest.update)
    .delete(guestPolicy.isAllowed, guest.remove);

  // Finish by binding the guest middleware
  app.param('guestId', guest.guestById);
};

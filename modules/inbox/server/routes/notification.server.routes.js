/**
 * Module Dependencies
 */
const notificationPolicy = require('../policies/notification.server.policy');
const notification = require('../controllers/notification.server.controller');

/**
 * Notification route configuration
 */
module.exports = function(app) {

  /**
   * Notification collection routes
   */
  app.route('/api/notification')
    .get(notificationPolicy.isAllowed, notification.list)
    .post(notificationPolicy.isAllowed, notification.create);

  /**
   * Single notification routes
   */
  app.route('/api/notification/:notificationId')
    .get(notificationPolicy.isAllowed, notification.read)
    .put(notificationPolicy.isAllowed, notification.update)
    .delete(notificationPolicy.isAllowed, notification.remove);

  /**
   * Finish by binding the notification middleware
   */
  app.param('notificationId', notification.notificationById);
};

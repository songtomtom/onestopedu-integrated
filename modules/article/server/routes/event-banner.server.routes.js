/**
 * Module Dependencies
 */
const eventBanner = require('../controllers/event-banner.server.controller');
const eventBannerPolicy = require('../policies/event-banner.server.policy');

/**
 * Event banner route configuration
 */
module.exports = function(app) {

  /**
   * Event banner collection routes
   */
  app.route('/api/event-banner')
    .get(eventBannerPolicy.isAllowed, eventBanner.list)
    .post(eventBannerPolicy.isAllowed, eventBanner.create);

  /**
   * Single event banner routes
   */
  app.route('/api/event-banner/:eventBannerId')
    .get(eventBannerPolicy.isAllowed, eventBanner.read)
    .put(eventBannerPolicy.isAllowed, eventBanner.update)
    .delete(eventBannerPolicy.isAllowed, eventBanner.remove);

  /**
   * Finish by binding the event banner middleware
   */
  app.param('eventBannerId', eventBanner.eventBannerById);
};

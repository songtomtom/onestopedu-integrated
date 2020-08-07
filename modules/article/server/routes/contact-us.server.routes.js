/**
 * Module Dependencies
 */
const contactUsPolicy = require('../policies/contact-us.server.policy');
const contactUs = require('../controllers/contact-us.server.controller');

/**
 * Contact us route configuration
 */
module.exports = function(app) {

  /**
   * Contact us collection routes
   */
  app.route('/api/contact-us')
    .get(contactUsPolicy.isAllowed, contactUs.list)
    .post(contactUsPolicy.isAllowed, contactUs.create);

  /**
   * Single contact us routes
   */
  app.route('/api/contact-us/:contactUsId')
    .get(contactUsPolicy.isAllowed, contactUs.read)
    .put(contactUsPolicy.isAllowed, contactUs.update)
    .delete(contactUsPolicy.isAllowed, contactUs.remove);

  /**
   * Finish by binding the contact us middleware
   */
  app.param('contactUsId', contactUs.contactUsById);
};

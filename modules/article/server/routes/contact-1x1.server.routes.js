/**
 * Module Dependencies
 */
const contact1x1Policy = require('../policies/contact-1x1.server.policy');
const contact1x1 = require('../controllers/contact-1x1.server.controller');

/**
 * Contact1x1 route configuration
 */
module.exports = function(app) {

  /**
   * Contact1x1 collection routes
   */
  app.route('/api/contact-1x1')
    .get(contact1x1Policy.isAllowed, contact1x1.list)
    .post(contact1x1Policy.isAllowed, contact1x1.create);

  /**
   * Single contact1x1 routes
   */
  app.route('/api/contact-1x1/:contact1x1Id')
    .get(contact1x1Policy.isAllowed, contact1x1.read)
    .put(contact1x1Policy.isAllowed, contact1x1.update)
    .delete(contact1x1Policy.isAllowed, contact1x1.remove);

  app.route('/api/contact-1x1/member/:memberId')
    .get(contact1x1Policy.isAllowed, contact1x1.listByMemberId);

  /**
   * Finish by binding the contact1x1 middleware
   */
  app.param('contact1x1Id', contact1x1.contact1x1ById);
};

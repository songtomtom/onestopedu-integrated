/**
 * Module Dependencies
 */
const faq = require('../controllers/faq.server.controller');
const faqPolicy = require('../policies/faq.server.policy');

/**
 * FAQ route configuration
 */
module.exports = function(app) {

  /**
   * FAQ collection routes
   */
  app.route('/api/faq')
    .get(faqPolicy.isAllowed, faq.list)
    .post(faqPolicy.isAllowed, faq.create);

  /**
   * Single FAQ routes
   */
  app.route('/api/faq/:faqId')
    .get(faqPolicy.isAllowed, faq.read)
    .put(faqPolicy.isAllowed, faq.update)
    .delete(faqPolicy.isAllowed, faq.remove);

  /**
   * Finish by binding the FAQ middleware
   */
  app.param('faqId', faq.faqById);
};

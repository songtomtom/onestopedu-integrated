/**
 * Module Dependencies
 */
const mailPolicy = require('../policies/mail.server.policy');
const mail = require('../controllers/mail.server.controller');

/**
 * E-mail route configuration
 */
module.exports = function(app) {
  app.route('/api/mail/send/assessment/:userId')
    .get(mailPolicy.isAllowed, mail.sendToTemplateByAssessment);
};

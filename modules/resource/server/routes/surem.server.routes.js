/**
 * Module Dependencies
 */
const suremPolicy = require('../policies/surem.server.policy');
const surem = require('../controllers/surem.server.controller');

/**
 * Talk Dream route configuration
 */
module.exports = function(app) {
  app.route('/api/surem')
    .get(suremPolicy.isAllowed, surem.list);

  app.route('/api/surem/sms')
    .post(suremPolicy.isAllowed, surem.sendSMS);

  app.route('/api/surem/lms')
    .post(suremPolicy.isAllowed, surem.sendLMS);

};

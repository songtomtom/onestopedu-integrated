/**
 * Module Dependencies
 */
const textbook = require('../controllers/textbook.server.controller');
const textbookPolicy = require('../policies/textbook.server.policy');

/**
 * Textbook route configuration
 */
module.exports = function(app) {
  app.route('/api/textbook')
    .get(textbookPolicy.isAllowed, textbook.list)
    .post(textbookPolicy.isAllowed, textbook.create);
  app.route('/api/textbook/:textbookId')
    .get(textbookPolicy.isAllowed, textbook.read)
    .put(textbookPolicy.isAllowed, textbook.update)
    .delete(textbookPolicy.isAllowed, textbook.remove);
  app.param('textbookId', textbook.textbookById);
};

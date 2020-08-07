/**
 * Module Dependencies
 */
const commentPolicy = require('../policies/comment.server.policy');
const comment = require('../controllers/comment.server.controller');

/**
 * Comment route configuration
 */
module.exports = function(app) {

  /**
   * Comment collection routes
   */
  app.route('/api/comment')
    .get(commentPolicy.isAllowed, comment.list)
    .post(commentPolicy.isAllowed, comment.create);

  /**
   * Single comment routes
   */
  app.route('/api/comment/:commentId')
    .get(commentPolicy.isAllowed, comment.read)
    .put(commentPolicy.isAllowed, comment.update)
    .delete(commentPolicy.isAllowed, comment.remove);

  /**
   * Finish by binding the comment middleware
   */
  app.param('commentId', comment.commentById);
};

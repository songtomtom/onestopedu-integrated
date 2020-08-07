/**
 * Module Dependencies
 */
const tutorBoardPolicy = require('../policies/tutor-board.server.policy');
const tutorBoard = require('../controllers/tutor-board.server.controller');

/**
 * Tutor Board route configuration
 */
module.exports = function(app) {

  /**
   * Tutor Board collection routes
   */
  app.route('/api/tutor-board')
    .get(tutorBoardPolicy.isAllowed, tutorBoard.list)
    .post(tutorBoardPolicy.isAllowed, tutorBoard.create);

  /**
   * Single tutor board routes
   */
  app.route('/api/tutor-board/:tutorBoardId')
    .get(tutorBoardPolicy.isAllowed, tutorBoard.read)
    .put(tutorBoardPolicy.isAllowed, tutorBoard.update)
    .delete(tutorBoardPolicy.isAllowed, tutorBoard.remove);

  /**
   * Finish by binding the tutor board middleware
   */
  app.param('tutorBoardId', tutorBoard.tutorBoardById);
};

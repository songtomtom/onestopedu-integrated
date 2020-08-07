/**
 * Module Dependencies
 */

const schedule = require('../controllers/schedule.server.controller');
const schedulePolicy = require('../policies/schedule.server.policy');

/**
 * Schedule route configuration
 */
module.exports = function(app) {

  /** Schedule collection routes */
  app.route('/api/schedule')
    .get(schedulePolicy.isAllowed, schedule.list)
    .post(schedulePolicy.isAllowed, schedule.create);

  /** Single Schedule routes */
  app.route('/api/schedule/:scheduleId')
    .get(schedulePolicy.isAllowed, schedule.read)
    .put(schedulePolicy.isAllowed, schedule.update)
    .delete(schedulePolicy.isAllowed, schedule.remove);

  app.route('/api/schedule/day/:day')
    .get(schedulePolicy.isAllowed, schedule.dayByList);

  app.route('/api/schedule/tutor/:tutorId')
    .get(schedulePolicy.isAllowed, schedule.tutorByList);

  app.route('/api/schedule/tutor/possible')
    .post(schedulePolicy.isAllowed, schedule.tutorPossibleByList);

  app.route('/api/schedule/member/:memberId')
    .get(schedulePolicy.isAllowed, schedule.listByMemberId);

  /** Finish by binding the Schedule middleware */
  app.param('scheduleId', schedule.scheduleById);
};

(function(app) {

  /** Schedule applicaion configuration module to register a new module */
  app.registerModule('schedule', ['core']);
  app.registerModule('schedule.services');
  app.registerModule('schedule.routes', ['core.routes', 'schedule.services', 'user.services']);
}(ApplicationConfiguration));

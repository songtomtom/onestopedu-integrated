((app) => {

  /**
   * Use Applicaion configuration module to register a new module
   */
  app.registerModule('user', ['core']);
  app.registerModule('user.services');
  app.registerModule('user.routes', ['core.routes', 'user.services']);
})(ApplicationConfiguration);

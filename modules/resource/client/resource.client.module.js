((app) => {

  /**
   * Feature Applicaion configuration module to register a new module
   */
  app.registerModule('resource', ['core']);
  app.registerModule('resource.services');
  app.registerModule('resource.routes', ['core.routes', 'resource.services', 'user.services']);
})(ApplicationConfiguration);

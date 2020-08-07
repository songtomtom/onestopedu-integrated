((app) => {

  /**
   * Article Applicaion configuration module to register a new module
   */
  app.registerModule('inbox', ['core']);
  app.registerModule('inbox.services');
  app.registerModule('inbox.routes', ['core.routes', 'inbox.services', 'user.services']);
})(ApplicationConfiguration);

((app) => {

  /**
   * Article Applicaion configuration module to register a new module
   */
  app.registerModule('article', ['core']);
  app.registerModule('article.services');
  app.registerModule('article.routes', ['core.routes', 'article.services', 'user.services']);
})(ApplicationConfiguration);

((app) => {
  // Core Applicaion configuration module to register a new module
  app.registerModule('core');
  app.registerModule('core.routes', ['ui.router']);
})(ApplicationConfiguration);

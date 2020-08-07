(function(window) {

  /**
   * Angular js application name
   */
  const applicationModuleName = 'integrated';

  /**
   * Initialize module configuration options
   */
  const service = {
    applicationEnvironment: window.env,
    applicationModuleVendorDependencies: [
      'ae-datetimepicker',
      'angular-md5',
      'checklist-model',
      'localytics.directives',
      'ngAnimate',
      'ngAudio',
      'ngFileUpload',
      'ngMask',
      'ngMessages',
      'ngResource',
      'ngSanitize',
      'pascalprecht.translate',
      'summernote',
      'toastr',
      'ui.bootstrap',
      'ui.calendar',
      'ui.router'
    ],
    applicationModuleName,
    registerModule
  };

  /**
   * Initialize root module configuration
   */
  window.ApplicationConfiguration = service;

  /**
   * Add a new vertical module
   */
  function registerModule(moduleName, dependencies = []) {

    /**
     * Create angular module
     */
    angular
      .module(moduleName, dependencies);

    /**
     * Add the module to the AngularJS configuration file
     */
    angular
      .module(applicationModuleName).requires.push(moduleName);
  }

}(window));

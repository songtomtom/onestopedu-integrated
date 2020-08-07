(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.routes')
    .config(routeConfig);

  /**
   * Dependency Injection
   */
  routeConfig.$inject = ['$stateProvider'];

  /**
   * Setting up route
   */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('resource', {
        abstract: true,
        url: '/resource',
        template: '<ui-view/>'
      });
  }
}());

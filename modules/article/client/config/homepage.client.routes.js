(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.routes')
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
      .state('homepage', {
        abstract: true,
        url: '/homepage',
        template: '<ui-view/>'
      });
  }
}());

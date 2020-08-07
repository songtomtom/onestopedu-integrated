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
      .state('cs-center.partnership', {
        abstract: true,
        url: '/partnership',
        template: '<ui-view/>'
      })
      .state('cs-center.partnership.list', {
        url: '/list',
        templateUrl: 'modules/article/client/views/partnership/list-partnership.client.view.html',
        controller: 'ListPartnershipController',
        controllerAs: 'vm'
      });
  }

}());

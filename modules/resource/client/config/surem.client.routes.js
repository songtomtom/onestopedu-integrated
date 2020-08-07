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
      .state('resource.surem', {
        abstract: true,
        url: '/surem',
        template: '<ui-view/>'
      })
      .state('resource.surem.list', {
        url: '/list',
        templateUrl: 'modules/resource/client/views/sms/list-surem.client.view.html',
        controller: 'ListSuremController',
        controllerAs: 'vm'
      });
  }

}());

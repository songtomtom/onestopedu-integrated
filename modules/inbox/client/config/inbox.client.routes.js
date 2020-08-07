(function() {

  /**
   * Module Configuration
   */
  angular
    .module('inbox.routes')
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
      .state('inbox', {
        abstract: true,
        url: '/inbox',
        templateUrl: 'modules/inbox/client/views/inbox.client.view.html',
        controller: 'InboxController',
        controllerAs: 'vm',
        data: {
          pageContentFullHeight: true,
          pageContentFullWidth: true
        }
      })
      .state('inbox.list-notification', {
        url: '/list-notification',
        templateUrl: 'modules/inbox/client/views/list-notification-inbox.client.view.html',
        controller: 'ListNotificationInboxController',
        controllerAs: 'vm'
      });
  }
}());

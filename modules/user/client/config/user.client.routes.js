(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.routes')
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
      .state('user', {
        abstract: true,
        url: '/user',
        template: '<ui-view/>'
      })

      /**
       * Setting
       */
      .state('user.profile', {
        url: '/profile',
        templateUrl: 'modules/user/client/views/profile.client.view.html',
        controller: 'ProfileController',
        controllerAs: 'vm',
        data: {
          pageContentFullHeight: true,
          pageContentFullWidth: true
        }
      });
  }

}());

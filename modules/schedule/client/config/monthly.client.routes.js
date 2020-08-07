(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.routes')
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
      .state('schedule.monthly', {
        abstract: true,
        url: '/monthly',
        template: '<ui-view/>'
      })
      .state('schedule.monthly.list', {
        url: '/list',
        templateUrl: 'modules/schedule/client/views/monthly/list-monthly.client.view.html',
        controller: 'ListMonthlyController',
        controllerAs: 'vm'
      })
      .state('schedule.monthly.add', {
        url: '/add',
        templateUrl: 'modules/schedule/client/views/monthly/add-monthly.client.view.html',
        controller: 'AddMonthlyController',
        controllerAs: 'vm',
        resolve: {
          monthlyResolve: newMonthly
        }
      });

    /** Dependency Injection */
    newMonthly.$inject = ['Monthly'];

    /**
     * New member resolve
     */
    function newMonthly(Monthly) {
      return new Monthly();
    }

  }

}());

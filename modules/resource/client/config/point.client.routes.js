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
      .state('resource.point', {
        abstract: true,
        url: '/point',
        template: '<ui-view/>'
      })
      .state('resource.point.list', {
        url: '/list',
        templateUrl: 'modules/resource/client/views/point/list-point.client.view.html',
        controller: 'ListPointController',
        controllerAs: 'vm'
      })
      .state('resource.point.pay', {
        url: '/pay',
        templateUrl: 'modules/resource/client/views/point/pay-point.client.view.html',
        controller: 'PayPointController',
        controllerAs: 'vm',
        resolve: {
          pointResolve: newPoint
        }
      });

    /**
     * Dependency Injection
     */
    newPoint.$inject = ['Point'];

    /**
     * New Point resource resolve
     */
    function newPoint(Point) {
      return new Point();
    }

    /**
     * Dependency Injection
     */
    getMember.$inject = ['$stateParams', 'Member'];

    /**
     * Get Member resolve
     */
    function getMember($stateParams, Member) {
      return Member.get({
        memberId: $stateParams.memberId
      }).$promise;
    }

  }

}());

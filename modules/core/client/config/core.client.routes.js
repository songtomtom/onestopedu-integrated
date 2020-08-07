(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core.routes')
    .config(routeConfig);

  /**
   * Dependency Injection
   */
  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  /**
   * Setting up route
   */
  function routeConfig($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.rule(($injector, $location) => {
      const path = $location.path();
      const hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {

        /**
         * If last character is a slash, return the same url without the slash
         */
        const newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    /**
     * Redirect to 404 when route not found
     */
    $urlRouterProvider.otherwise(($injector, $location) => {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    /**
     * Home state routing
     */
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/client/views/home.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/client/views/404.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: 'modules/core/client/views/400.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true
        }
      });
  }
}());

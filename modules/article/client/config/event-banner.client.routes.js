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
      .state('homepage.event-banner', {
        abstract: true,
        url: '/event-banner',
        template: '<ui-view/>'
      })
      .state('homepage.event-banner.list', {
        url: '/list',
        templateUrl: 'modules/article/client/views/event-banner/list-event-banner.client.view.html',
        controller: 'ListEventBannerController',
        controllerAs: 'vm'
      })
      .state('homepage.event-banner.view', {
        url: '/:eventBannerId/view',
        templateUrl: 'modules/article/client/views/event-banner/view-event-banner.client.view.html',
        controller: 'ViewEventBannerController',
        controllerAs: 'vm',
        resolve: {
          eventBannerResolve: getEventBanner
        }
      })
      .state('homepage.event-banner.create', {
        url: '/create',
        templateUrl: 'modules/article/client/views/event-banner/create-event-banner.client.view.html',
        controller: 'CreateEventBannerController',
        controllerAs: 'vm',
        resolve: {
          eventBannerResolve: newEventBanner
        }
      })
      .state('homepage.event-banner.modify', {
        url: '/:eventBannerId/edit',
        templateUrl: 'modules/article/client/views/event-banner/edit-event-banner.client.view.html',
        controller: 'ModifyEventBannerController',
        controllerAs: 'vm',
        resolve: {
          eventBannerResolve: getEventBanner
        }
      });

    /** Dependency Injection */
    getEventBanner.$inject = ['$stateParams', 'EventBanner'];

    /**
     * Get event banner resolve
     */
    function getEventBanner($stateParams, EventBanner) {
      return EventBanner.get({
        eventBannerId: $stateParams.eventBannerId
      }).$promise;
    }

    /** Dependency Injection */
    newEventBanner.$inject = ['EventBanner'];

    /**
     * New event banner resolve
     */
    function newEventBanner(EventBanner) {
      return new EventBanner();
    }
  }

}());

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
      .state('resource.talk-dream', {
        abstract: true,
        url: '/talk-dream',
        template: '<ui-view/>'
      })
      .state('resource.talk-dream.list', {
        url: '/list',
        templateUrl: 'modules/resource/client/views/sms/list-talk-dream.client.view.html',
        controller: 'ListTalkDreamController',
        controllerAs: 'vm'
      });
  }

}());

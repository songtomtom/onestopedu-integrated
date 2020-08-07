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
      .state('schedule.lesson', {
        abstract: true,
        url: '/lesson',
        template: '<ui-view/>'
      })
      .state('schedule.lesson.list', {
        url: '/list',
        templateUrl: 'modules/schedule/client/views/lesson/list-lesson.client.view.html',
        controller: 'ListLessonController',
        controllerAs: 'vm'
      });
  }
}());

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
      .state('schedule.course', {
        abstract: true,
        url: '/course',
        template: '<ui-view/>'
      })
      .state('schedule.course.list', {
        url: '/list',
        templateUrl: 'modules/schedule/client/views/course/list-course.client.view.html',
        controller: 'ListCourseController',
        controllerAs: 'vm'
      });
  }
}());

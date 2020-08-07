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
      .state('schedule', {
        abstract: true,
        url: '/schedule',
        template: '<ui-view/>'
      })
      .state('schedule.daily', {
        url: '/daily',
        templateUrl: 'modules/schedule/client/views/daily-schedule.client.view.html',
        controller: 'DailyScheduleController',
        controllerAs: 'vm'
      })
      .state('schedule.calendar', {
        url: '/calendar',
        templateUrl: 'modules/schedule/client/views/calendar-schedule.client.view.html',
        controller: 'CalendarScheduleController',
        controllerAs: 'vm'
      })
      .state('schedule.my-calendar', {
        url: '/my-calendar',
        templateUrl: 'modules/schedule/client/views/my-calendar-schedule.client.view.html',
        controller: 'MyCalendarScheduleController',
        controllerAs: 'vm'
      });
  }

}());

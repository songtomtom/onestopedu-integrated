(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.services')
    .factory('Assessment', Assessment);

  /**
   * Dependency Injection
   */
  Assessment.$inject = ['$resource'];

  /**
   * Assessment service for REST end assessment
   */
  function Assessment($resource) {
    return $resource('/api/assessment/:assessmentId', {
      assessmentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

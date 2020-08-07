(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.services')
    .factory('Feedback', Feedback);

  /**
   * Dependency Injection
   */
  Feedback.$inject = ['$resource'];

  /**
   * Feedback service for REST end feedback
   */
  function Feedback($resource) {
    return $resource('/api/feedback/:feedbackId', {
      feedbackId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

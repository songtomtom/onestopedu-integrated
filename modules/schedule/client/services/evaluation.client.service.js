(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.services')
    .factory('Evaluation', Evaluation);

  /**
   * Dependency Injection
   */
  Evaluation.$inject = ['$resource'];

  /**
   * Evaluation service for REST end evaluation
   */
  function Evaluation($resource) {
    return $resource('/api/evaluation/:evaluationId', {
      evaluationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

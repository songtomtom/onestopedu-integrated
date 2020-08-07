(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.services')
    .factory('Partnership', Partnership);

  /**
   * Dependency Injection
   */
  Partnership.$inject = ['$resource'];

  /**
   * Partnership service for REST endpoint
   */
  function Partnership($resource) {
    return $resource('/api/partnership/:partnershipId', {
      partnershipId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

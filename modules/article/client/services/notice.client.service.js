(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.services')
    .factory('Notice', Notice);

  /**
   * Dependency Injection
   */
  Notice.$inject = ['$resource'];

  /**
   * Notice service for REST endpoint
   */
  function Notice($resource) {
    return $resource('/api/notice/:noticeId', {
      noticeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

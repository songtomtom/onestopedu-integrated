(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.services')
    .factory('Comment', Comment);

  /**
   * Dependency Injection
   */
  Comment.$inject = ['$resource'];

  /**
   * Comment service for REST endpoint
   */
  function Comment($resource) {
    return $resource('/api/comment/:commentId', {
      commentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

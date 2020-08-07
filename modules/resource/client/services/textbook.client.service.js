(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.services')
    .factory('Textbook', Textbook);

  /**
   * Dependency Injection
   */
  Textbook.$inject = ['$resource'];

  /**
   * Textbook resource service for REST end textbook
   */
  function Textbook($resource) {
    return $resource('/api/textbook/:textbookId', {
      textbookId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

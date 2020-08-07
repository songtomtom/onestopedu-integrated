(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.services')
    .factory('FAQ', FAQ);

  /**
   * Dependency Injection
   */
  FAQ.$inject = ['$resource'];

  /**
   * FAQ service for REST endpoint
   */
  function FAQ($resource) {
    return $resource('/api/faq/:faqId', {
      faqId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

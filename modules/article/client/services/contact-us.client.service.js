(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.services')
    .factory('ContactUs', ContactUs);

  /**
   * Dependency Injection
   */
  ContactUs.$inject = ['$resource'];

  /**
   * Contact Us service for REST endpoint
   */
  function ContactUs($resource) {
    return $resource('/api/contact-us/:contactUsId', {
      contactUsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

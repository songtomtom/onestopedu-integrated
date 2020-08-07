(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.services')
    .factory('Guest', Guest);

  /**
   * Dependency Injection
   */
  Guest.$inject = ['$resource'];

  /**
   *  Guest service used for communicating with the guests REST endpoint
   */
  function Guest($resource) {
    return $resource('/api/guest/:guestId', {
      guestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      signup: {
        method: 'POST',
        url: '/api/guest'
      }
    });
  }
}());

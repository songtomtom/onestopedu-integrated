(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.services')
    .factory('CSManager', CSManager);

  /**
   * Dependency Injection
   */
  CSManager.$inject = ['$resource'];

  /**
   *  CS Manager service used for communicating with the cs managers REST endpoint
   */
  function CSManager($resource) {
    return $resource('/api/cs-manager/:csManagerId', {
      csManagerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      signup: {
        method: 'POST',
        url: '/api/cs-manager'
      }
    });
  }
}());

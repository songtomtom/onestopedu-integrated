(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.services')
    .factory('Admin', Admin);

  /**
   * Dependency Injection
   */
  Admin.$inject = ['$resource'];

  /**
   *  Admin service used for communicating with the admins REST endpoint
   */
  function Admin($resource) {
    return $resource('/api/admin/:adminId', {
      adminId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      signup: {
        method: 'POST',
        url: '/api/admin'
      }
    });
  }
}());

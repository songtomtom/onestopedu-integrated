(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.services')
    .factory('User', User);

  /**
   * Dependency Injection
   */
  User.$inject = ['$resource'];

  /**
   *  Users service used for communicating with the users REST endpoint
   */
  function User($resource) {
    const service = $resource('/api/user/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      changePassword: {
        method: 'POST',
        url: '/api/user/password'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      }
    });

    angular.extend(service, {
      changeUserPassword
    });

    return service;

    function changeUserPassword(passwordDetails) {
      return this.changePassword(passwordDetails)
        .$promise;
    }
  }
}());

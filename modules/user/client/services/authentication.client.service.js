(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.services')
    .factory('Authentication', Authentication);

  /**
   * Dependency Injection
   */
  Authentication.$inject = ['$window'];

  /**
   * Authentication service for user variables
   */
  function Authentication($window) {
    return {
      user: $window.user
    };
  }
}());

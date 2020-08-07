(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.services')
    .factory('TutorManager', TutorManager);

  /**
   * Dependency Injection
   */
  TutorManager.$inject = ['$resource'];

  /**
   *  Tutor Manager service used for communicating with the tutor managers REST endpoint
   */
  function TutorManager($resource) {
    return $resource('/api/tutor-manager/:tutorManagerId', {
      tutorManagerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      signup: {
        method: 'POST',
        url: '/api/tutor-manager'
      }
    });
  }
}());

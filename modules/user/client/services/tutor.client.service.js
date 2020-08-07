(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.services')
    .factory('Tutor', Tutor);

  /**
   * Dependency Injection
   */
  Tutor.$inject = ['$resource'];

  /**
   *  Tutor service used for communicating with the tutors REST endpoint
   */
  function Tutor($resource) {
    const service = $resource('/api/tutor/:tutorId', {
      tutorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      signup: {
        method: 'POST',
        url: '/api/tutor'
      },
      nationByList: {
        method: 'POST',
        url: '/api/tutor/nation',
        isArray: true
      },
      tutorsByList: {
        method: 'POST',
        url: '/api/tutor/tutors',
        isArray: true
      }
    });

    angular.extend(service, {
      findOne,
      find
    });

    return service;

    function findOne(tutorId) {
      return this.get({
        tutorId
      }).$promise;
    }

    function find(providers) {
      return this.query()
        .$promise;
    }
  }
}());

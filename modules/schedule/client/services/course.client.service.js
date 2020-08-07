(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.services')
    .factory('Course', Course);

  /**
   * Dependency Injection
   */
  Course.$inject = ['$resource'];

  /**
   * Course resource service for REST end Course
   */
  function Course($resource) {
    const service = $resource('/api/course/:courseId', {
      courseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      listByMemberId: {
        method: 'GET',
        url: '/api/course/member/:memberId',
        isArray: true,
        params: {
          memberId: '='
        }
      }
    });

    /** Extend */
    angular.extend(service, {
      findOne,
      findByMemberId
    });

    return service;

    function findOne(courseId) {
      return this.get({
        courseId
      }).$promise;
    }

    function findByMemberId(memberId) {
      return this.listByMemberId({
        memberId
      }).$promise;
    }
  }
}());

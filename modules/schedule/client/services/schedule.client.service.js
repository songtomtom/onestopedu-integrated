(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.services')
    .factory('Schedule', Schedule);

  /**
   * Dependency Injection
   */
  Schedule.$inject = ['$resource'];

  /**
   * Schedule resource service for REST end schedule
   */
  function Schedule($resource) {
    const service = $resource('/api/schedule/:scheduleId', {
      scheduleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      dayByList: {
        method: 'GET',
        url: '/api/schedule/day/:day',
        isArray: true,
        params: {
          day: '='
        }
      },
      tutorByList: {
        method: 'GET',
        url: '/api/schedule/tutor/:tutorId',
        isArray: true,
        params: {
          tutorId: '='
        }
      },
      tutorPossibleByList: {
        method: 'POST',
        url: '/api/schedule/tutor/possible',
        isArray: true
      },
      listByMemberId: {
        method: 'GET',
        url: '/api/schedule/member/:memberId',
        isArray: true,
        params: {
          memberId: '='
        }
      }
    });

    angular.extend(service, {
      find,
      findByDay,
      findByMemberId
    });

    return service;

    function find() {
      return this.query()
        .$promise;
    }

    function findByDay(day) {
      return this.dayByList({
        day: day.toDate()
      }).$promise;
    }

    function findByMemberId(memberId) {
      return this.listByMemberId({
        memberId
      }).$promise;
    }
  }
}());

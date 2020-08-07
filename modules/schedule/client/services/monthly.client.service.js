(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.services')
    .factory('Monthly', Monthly);

  /**
   * Dependency Injection
   */
  Monthly.$inject = ['$resource'];

  /**
   * Monthly resource service for REST end monthly
   */
  function Monthly($resource) {
    const service = $resource('/api/monthly/:monthlyId', {
      monthlyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST',
        url: '/api/monthly/course',
        isArray: true
      },
      listByCourseId: {
        method: 'GET',
        url: '/api/monthly/course/:courseId',
        isArray: true,
        params: {
          courseId: '='
        }
      },
      monthByList: {
        method: 'GET',
        url: '/api/monthly/month/:month',
        isArray: true,
        params: {
          month: '='
        }
      },
      listByMemberId: {
        method: 'GET',
        url: '/api/monthly/member/:memberId',
        isArray: true,
        params: {
          memberId: '='
        }
      }
    });

    angular.extend(service, {
      createMonthlies,
      findByCourseId,
      findByMonth,
      findByMemberId
    });

    return service;

    function createMonthlies(monthlies) {
      return this.create(monthlies)
        .$promise;
    }

    /** Find by course */
    function findByCourseId(courseId) {
      return this.listByCourseId({
        courseId
      }).$promise;
    }

    function findByMonth(month) {
      return this.monthByList({
        month: month.toDate()
      }).$promise;
    }

    function findByMemberId(memberId) {
      return this.listByMemberId({
        memberId
      }).$promise;
    }
  }
}());

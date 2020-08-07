(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.services')
    .factory('Point', Point);

  /**
   * Dependency Injection
   */
  Point.$inject = ['$resource'];

  /**
   * Point resource service for REST end point
   */
  function Point($resource) {
    const service = $resource('/api/point/:pointId', {
      pointId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      save: {
        method: 'POST',
        url: '/api/point/member/:memberId',
        params: {
          memberId: '='
        }
      },
      listByMemberId: {
        method: 'GET',
        url: '/api/point/member/:memberId',
        isArray: true,
        params: {
          memberId: '='
        }
      }
    });


    angular.extend(service, {
      savePoint,
      findByMemberId
    });

    return service;

    /**
     * Find member by list
     */
    function findByMemberId(memberId) {
      return this.listByMemberId({
        memberId
      }).$promise;
    }

    /**
     * Save point
     */
    function savePoint(doc) {
      return this.save({
          memberId: doc.user
        }, doc)
        .$promise;
    }

  }
}());

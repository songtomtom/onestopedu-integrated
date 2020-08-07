(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.services')
    .factory('Leveltest', Leveltest);

  /**
   * Dependency Injection
   */
  Leveltest.$inject = ['$resource'];

  /**
   * Leveltest resource service for REST end leveltest
   */
  function Leveltest($resource) {
    const service = $resource('/api/leveltest/:leveltestId', {
      leveltestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      userByList: {
        method: 'GET',
        url: '/api/leveltest/user/:userId',
        isArray: true,
        params: {
          userId: '='
        }
      }
    });

    angular.extend(service, {
      findByUser
    });


    function findByUser(userId) {
      return this.userByList({
        userId
      }).$promise;
    }

    return service;
  }
}());

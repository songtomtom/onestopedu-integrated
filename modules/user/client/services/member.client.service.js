(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.services')
    .factory('Member', Member);

  /**
   * Dependency Injection
   */
  Member.$inject = ['$resource'];

  /**
   *  User service used for communicating with the members REST endpoint
   */
  function Member($resource) {
    const service = $resource('/api/member/:memberId', {
      memberId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      signup: {
        method: 'POST',
        url: '/api/member'
      },
      providersByList: {
        method: 'GET',
        url: '/api/member/providers/:providers',
        params: {
          providers: '@providers'
        },
        isArray: true
      },
      holdByList: {
        method: 'POST',
        url: '/api/member/state/hold',
        isArray: true
      }
    });

    angular.extend(service, {
      findOne,
      findByProviders
    });

    return service;

    function findOne(memberId) {
      return this.get({
        memberId
      }).$promise;
    }

    function findByProviders(providers) {
      return this.providersByList({
        providers
      }).$promise;
    }

  }
}());

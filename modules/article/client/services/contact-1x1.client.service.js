(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.services')
    .factory('Contact1x1', Contact1x1);

  /**
   * Dependency Injection
   */
  Contact1x1.$inject = ['$resource'];

  /**
   * Contact1x1 service for REST endpoint
   */
  function Contact1x1($resource) {
    const service = $resource('/api/contact-1x1/:contact1x1Id', {
      contact1x1Id: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      listByMemberId: {
        method: 'GET',
        url: '/api/contact-1x1/member/:memberId',
        isArray: true,
        params: {
          memberId: '='
        }
      }
    });

    angular.extend(service, {
      findByMemberId
    });

    return service;


    function findByMemberId(memberId) {
      return this.listByMemberId({
        memberId
      }).$promise;
    }
  }
}());

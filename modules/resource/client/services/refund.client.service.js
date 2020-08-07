(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.services')
    .factory('Refund', Refund);

  /**
   * Dependency Injection
   */
  Refund.$inject = ['$resource'];

  /**
   * Refund service for REST end refund
   */
  function Refund($resource) {
    return $resource('/api/refund/:refundId', {
      refundId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      listByMemberId: {
        method: 'GET',
        url: '/api/refund/member/:memberId',
        isArray: true,
        params: {
          memberId: '='
        }
      }
    });
  }
}());

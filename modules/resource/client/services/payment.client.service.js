(function() {

  angular
    .module('resource.services')
    .factory('Payment', Payment);

  Payment.$inject = ['$resource'];

  /**
   * Payment service used for communicating with the payment REST endpoint
   * @constructor
   */
  function Payment($resource) {
    return $resource('/api/payment/:paymentId', {
      paymentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      listByMemberId: {
        method: 'GET',
        url: '/api/payment/member/:memberId',
        isArray: true,
        params: {
          memberId: '='
        }
      }
    });
  }
}());

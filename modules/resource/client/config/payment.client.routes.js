(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.routes')
    .config(routeConfig);

  /**
   * Dependency Injection
   */
  routeConfig.$inject = ['$stateProvider'];

  /**
   * Setting up route
   */
  function routeConfig($stateProvider) {

    $stateProvider
      .state('payment', {
        abstract: true,
        url: '/payment',
        template: '<ui-view/>'
      })
      .state('payment.list', {
        url: '/list',
        templateUrl: 'modules/resource/client/views/payment/list-payment.client.view.html',
        controller: 'ListPaymentController',
        controllerAs: 'vm'
      })
      .state('payment.virtual', {
        url: '/virtual',
        templateUrl: 'modules/resource/client/views/payment/virtual-payment.client.view.html',
        controller: 'VirtualPaymentController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: newPayment
        }
      });

    /**
     * Dependency Injection
     */
    newPayment.$inject = ['Payment'];

    /**
     * New Payment resolve
     */
    function newPayment(Payment) {
      return new Payment();
    }
  }

}());

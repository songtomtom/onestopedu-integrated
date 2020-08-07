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
      .state('resource.coupon', {
        abstract: true,
        url: '/coupon',
        template: '<ui-view/>'
      })
      .state('resource.coupon.list', {
        url: '/list',
        templateUrl: 'modules/resource/client/views/coupon/list-coupon.client.view.html',
        controller: 'ListCouponController',
        controllerAs: 'vm'
      })
      .state('resource.coupon.modify', {
        url: '/:couponId/modify',
        templateUrl: 'modules/resource/client/views/coupon/modify-coupon.client.view.html',
        controller: 'ModifyCouponController',
        controllerAs: 'vm',
        resolve: {
          couponResolve: getCoupon
        }
      })
      .state('resource.coupon.generate', {
        url: '/generate',
        templateUrl: 'modules/resource/client/views/coupon/generate-coupon.client.view.html',
        controller: 'GenerateCouponController',
        controllerAs: 'vm',
        resolve: {
          couponResolve: newCoupon
        }
      });

    /**
     * Dependency Injection
     */
    getCoupon.$inject = ['$stateParams', 'Coupon'];

    /**
     * Get Coupon resource resolve
     */
    function getCoupon($stateParams, Coupon) {
      return Coupon.get({
        couponId: $stateParams.couponId
      }).$promise;
    }

    /**
     * Dependency Injection
     */
    newCoupon.$inject = ['Coupon'];

    /**
     * New Coupon resource resolve
     */
    function newCoupon(Coupon) {
      return new Coupon();
    }

    /**
     * Dependency Injection
     */
    getMember.$inject = ['$stateParams', 'Member'];

    /**
     * Get Member resolve
     */
    function getMember($stateParams, Member) {
      return Member.get({
        memberId: $stateParams.memberId
      }).$promise;
    }

  }

}());

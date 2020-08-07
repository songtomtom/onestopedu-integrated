(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('AddCouponByMemberController', AddCouponByMemberController);

  /**
   * Dependency Injection
   */
  AddCouponByMemberController.$inject = [
    '$scope',
    '$window',
    '$state',
    'memberResolve',
    'Coupon',
    'Authentication',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the pay coupon controller
   */
  function AddCouponByMemberController(
    $scope,
    $window,
    $state,
    member,
    Coupon,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.member = member;
    vm.findCoupon = findCoupon;
    vm.addCoupon = addCoupon;

    function addCoupon(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.couponForm');
        return false;
      }

      Coupon.addCoupon(vm.coupon._id, vm.member._id)
        .then(onAddCouponSuccess)
        .catch(onAddCouponError);

      // Find coupon success callback
      function onAddCouponSuccess(coupon) {
        $state.go('resource.coupon.list');
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      }

      // Find coupon error callback
      function onAddCouponError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Find coupon
     */
    function findCoupon(code) {
      /**
       * Coupon code "N4GF-TQ2R-DZGO-6LW5"
       * Only string length 16 + hyphen(-) length 3
       * Total length is 19
       */
      if (!angular.isString(code)) {
        vm.coupon = undefined;
        return false;
      }

      const couponCode = code
        .split('-')
        .join('')
        .toUpperCase();

      Coupon.findOneByCode(couponCode)
        .then(onFindCouponSuccess)
        .catch(onFindCouponError);

      // Find coupon success callback
      function onFindCouponSuccess(coupon) {
        if (coupon._id) {
          vm.coupon = coupon;
        } else {
          vm.coupon = undefined;
        }
      }

      // Find coupon error callback
      function onFindCouponError(err) {
        vm.coupon = undefined;
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }
}());

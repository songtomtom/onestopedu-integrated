(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ModifyCouponByMemberController', ModifyCouponByMemberController);

  /**
   * Dependency Injection
   */
  ModifyCouponByMemberController.$inject = [
    '$scope',
    '$window',
    '$state',
    'couponResolve',
    'Coupon',
    'Authentication',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the pay coupon controller
   */
  function ModifyCouponByMemberController(
    $scope,
    $window,
    $state,
    coupon,
    Coupon,
    Authentication,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.coupon = coupon;
    vm.modifyCoupon = modifyCoupon;
    vm.removeCoupon = removeCoupon;
    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initDatePickerOptions();
    }

    /**
     * Init datetimepicker default date + 5 year
     */
    function initDatePickerOptions() {
      vm.datetimePickerOptions.format = 'YYYY/MM/DD';
      vm.datetimePickerOptions.viewMode = 'days';
      vm.datetimePickerOptions.defaultDate = moment(vm.coupon.expired);
    }

    /**
     * Modify Coupons
     */
    function modifyCoupon(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.couponForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this coupon?')) {
        vm.coupon.$update()
          .then(onUpdateCouponSuccess)
          .catch(onUpdateCouponError);
      }

      // Update coupon success callback
      function onUpdateCouponSuccess(coupon) {
        vm.coupon = coupon;
        $state.reload();
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      }

      // Update coupon error callback
      function onUpdateCouponError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Remove or Delete coupon
     */
    function removeCoupon(couponId, memberId) {
      if ($window.confirm('Are you sure you want to remove this coupon?')) {
        Coupon.removeCoupon(couponId, memberId)
          .then(onRemoveCouponSuccess)
          .catch(onRemoveCouponError);
      }

      // Update coupon success callback
      function onRemoveCouponSuccess(coupon) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('member.view.coupon.list', {}, {
          reload: true
        });
      }

      // Update coupon error callback
      function onRemoveCouponError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Regist Coupons
     */
    // function registCoupon(isValid) {
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'vm.form.couponForm');
    //     return false;
    //   }
    //
    //   if ($window.confirm('Are you sure you want to modify this coupon?')) {
    //     vm.coupon.user = vm.member._id;
    //     vm.coupon.$update()
    //       .then(onUpdateCouponSuccess)
    //       .catch(onUpdateCouponError);
    //   }
    //
    //   // Regist coupon success callback
    //   function onUpdateCouponSuccess(coupon) {
    //     Member.findOne(coupon.user)
    //       .then(onFindMemberSuccess)
    //       .catch(onFindMemberError);
    //   }
    //
    //   // Regist coupon error callback
    //   function onUpdateCouponError(err) {
    //     toastr.error(err.data.message, 'Error', {
    //       timeOut: 0
    //     });
    //   }
    //
    //   // Regist coupon success callback
    //   function onFindMemberSuccess(member) {
    //     member.push(vm.coupon);
    //     member.$update()
    //       .then(onUpdateMemberSuccess)
    //       .catch(onUpdateMemberError);
    //
    //   }
    //
    //   // Regist coupon error callback
    //   function onFindMemberError(err) {
    //     toastr.error(err.data.message, 'Error', {
    //       timeOut: 0
    //     });
    //   }
    //
    //   // Regist coupon success callback
    //   function onUpdateMemberSuccess(member) {
    //     $state.reload();
    //     toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
    //   }
    //
    //   // Regist coupon error callback
    //   function onUpdateMemberError(err) {
    //     toastr.error(err.data.message, 'Error', {
    //       timeOut: 0
    //     });
    //   }
    // }
  }
}());

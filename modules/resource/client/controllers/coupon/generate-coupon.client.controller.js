(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('GenerateCouponController', GenerateCouponController);

  /**
   * Dependency Injection
   */
  GenerateCouponController.$inject = [
    '$scope',
    '$window',
    '$state',
    'couponResolve',
    'Coupon',
    'Member',
    'Authentication',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the pay coupon controller
   */
  function GenerateCouponController(
    $scope,
    $window,
    $state,
    coupon,
    Coupon,
    Member,
    Authentication,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.coupon = coupon;
    vm.generateCoupon = generateCoupon;
    vm.datetimePickerOptions = angular.copy(dayPickerConfig);
    vm.figureOutMember = figureOutMember;

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initDatePickerOptions();
      initDiscountRate();
      initDiscountType();
      initGenerateCount();

      // Init datetimepicker default date + 5 year
      function initDatePickerOptions() {
        vm.datetimePickerOptions.format = 'YYYY/MM/DD';
        vm.datetimePickerOptions.viewMode = 'days';
        vm.datetimePickerOptions.defaultDate = moment().add('year', 5);
      }

      // Init discount type
      function initDiscountRate() {
        vm.discountRate = 10;
      }

      // Init discount type
      function initDiscountType() {
        vm.coupon.discountType = 'rate';
      }

      // Init generate coupon count
      function initGenerateCount() {
        vm.coupon.generateCount = 1;
      }
    }

    /**
     * Figure out member to display
     */
    function figureOutMember() {
      Member.findByProviders(vm.coupon.providers)
        .then(onFindMemberSuccess)
        .catch(onFindMemberError);

      // Find provider by list success callback
      function onFindMemberSuccess(members) {
        vm.members = members;
      }
      // Find provider by list error callback
      function onFindMemberError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Generate Coupons
     */
    function generateCoupon(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.couponForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to pay this coupon?')) {
        vm.coupon.publisher = vm.auth.user._id;
        vm.coupon.amount = (vm.coupon.discountType === 'rate') ?
          vm.discountRate : vm.discountPrice;
        vm.coupon.user = (vm.member) ? vm.member._id : undefined;
        // vm.coupon.pastCoupon = vm.member.coupon;
        Coupon.generateCoupon(vm.coupon)
          .then(onSaveCouponSuccess)
          .catch(onSaveCouponError);
      }

      // Save coupon success callback
      function onSaveCouponSuccess(coupons) {
        if (vm.coupon.user) {
          Member.findOne(vm.member._id)
            .then((member) => {
              onFindMemberSuccess(member, coupons);
            })
            .catch(onFindMemberError);
        } else {
          $state.go('resource.coupon.list');
          toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        }
      }

      // Save coupon error callback
      function onSaveCouponError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      // Find member success callback
      function onFindMemberSuccess(member, coupons) {
        coupons.forEach((coupon) => {
          member.coupons.push(coupon._id);
        });
        member.$update()
          .then(onUpdateMemberSuccess)
          .catch(onUpdateMemberError);
      }

      // Find member error callback
      function onFindMemberError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      // Update member success callback
      function onUpdateMemberSuccess(member) {
        $state.go('member.view.coupon.list', {
          memberId: member._id
        });
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      }

      // Update member error callback
      function onUpdateMemberError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

    }
  }
}());

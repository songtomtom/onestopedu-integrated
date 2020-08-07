(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('ModifyCouponController', ModifyCouponController);

  /**
   * Dependency Injection
   */
  ModifyCouponController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$filter',
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
  function ModifyCouponController(
    $scope,
    $window,
    $state,
    $filter,
    coupon,
    Coupon,
    Member,
    Authentication,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.$state = $state;
    vm.auth = Authentication;
    vm.coupon = coupon;
    vm.modifyCoupon = modifyCoupon;
    vm.datetimePickerOptions = angular.copy(dayPickerConfig);
    vm.figureOut = figureOut;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.pageChanged = pageChanged;
    vm.removeCoupon = removeCoupon;

    vm.changeItemsPerPage = changeItemsPerPage;

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initDatePickerOptions();
      initMemberList();
      initCouponList();

    }

    /**
     * Init datetimepicker default date + 5 year
     */
    function initDatePickerOptions() {
      vm.datetimePickerOptions.format = 'YYYY/MM/DD';
      vm.datetimePickerOptions.viewMode = 'days';
      vm.datetimePickerOptions.defaultDate = moment().add('year', 5);
    }

    /**
     * Init member list by providers
     */
    function initMemberList() {
      Member.findByProviders(vm.coupon.providers)
        .then(onFindMemberSuccess)
        .catch(onFindMemberError);
      // Find provider by list success callback
      function onFindMemberSuccess(members) {
        vm.members = members;
      }
      // Find provider by list success callback
      function onFindMemberError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Init coupon list by providers
     */
    function initCouponList() {
      Coupon.findByGroupId(vm.coupon.groupId)
        .then(onFindCouponSuccess)
        .catch(onFindCouponError);
      // Find coupon success callback
      function onFindCouponSuccess(coupons) {
        vm.coupons = coupons;
        buildPager();
      }
      // Find coupon success callback
      function onFindCouponError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Build page
     */
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOut();
    }

    /**
     * Figure out to display
     */
    function figureOut() {
      vm.filteredItems = $filter('filter')(vm.coupons, vm.search);
      vm.filterLength = vm.filteredItems.length;
      const begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      const end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }



    /**
     * Change page event
     */
    function pageChanged() {
      vm.figureOut();
    }

    /**
     * Change item per page number
     */
    function changeItemsPerPage(itemsPerPage) {
      if (itemsPerPage) {
        vm.itemsPerPage = itemsPerPage;
        vm.figureOut();
      }
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
        $state.go('resource.coupon.list');
      }

      // Update coupon error callback
      function onRemoveCouponError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }
}());

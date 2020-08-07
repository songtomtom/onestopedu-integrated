(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('ListCouponController', ListCouponController);

  /**
   * Dependency Injection
   */
  ListCouponController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$filter',
    'Coupon',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the Coupon list controller
   */
  function ListCouponController(
    $scope,
    $state,
    $window,
    $filter,
    Coupon,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.figureOut = figureOut;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.pageChanged = pageChanged;
    vm.reloadFilter = reloadFilter;
    vm.changeItemsPerPage = changeItemsPerPage;
    vm.removeCoupon = removeCoupon;
    vm.search = {};

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Coupon list
     */
    Coupon.query((coupons) => {
      vm.coupons = coupons;
      buildPager();
    });

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
     * Filter reload
     */
    function reloadFilter() {
      vm.search = {};
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
        $window.location.reload();
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

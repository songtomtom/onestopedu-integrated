(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListPaymentByMemberController', ListPaymentByMemberController);

  /**
   * Dependency Injection
   */
  ListPaymentByMemberController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$filter',
    'memberResolve',
    'Payment',
    'toastr'
  ];

  /**
   * Configuring the Payment list controller
   */
  function ListPaymentByMemberController(
    $scope,
    $state,
    $window,
    $filter,
    member,
    Payment,
    toastr
  ) {

    const vm = this;

    vm.$state = $state;
    vm.member = member;
    vm.search = {};
    vm.itemsPerPageNumbers = [5, 10];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Payment list
     */
    Payment.listByMemberId({
        memberId: vm.member._id
      })
      .$promise
      .then((payments) => {
        vm.payments = payments;
        buildPager();
      });


    /**
     * Build page
     */
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOut();
    }

    /**
     * Figure out to display
     */
    function figureOut() {

      vm.filteredItems = $filter('filter')(vm.payments, vm.search);
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
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }
  }

}());

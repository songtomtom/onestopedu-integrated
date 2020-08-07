(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('ListPaymentController', ListPaymentController);

  /**
   * Dependency Injection
   */
  ListPaymentController.$inject = [
    '$scope',
    '$rootScope',
    '$window',
    '$filter',
    'Payment',
    'toastr'
  ];

  /**
   * Configuring the Payment list controller
   */
  function ListPaymentController(
    $scope,
    $rootScope,
    $window,
    $filter,
    Payment,
    toastr
  ) {

    const vm = this;

    vm.figureOut = figureOut;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.pageChanged = pageChanged;
    vm.search = {};

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Payment list
     */
    Payment.query((payments) => {
      vm.payments = payments;
      console.log(payments);



      vm.payments.forEach((item) => {
        console.log(item.paymentedProduct);
      });

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

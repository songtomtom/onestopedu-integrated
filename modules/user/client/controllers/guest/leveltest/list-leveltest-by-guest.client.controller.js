(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListLeveltestByGuestController', ListLeveltestByGuestController);

  /**
   * Dependency Injection
   */
  ListLeveltestByGuestController.$inject = [
    '$scope',
    '$state',
    '$filter',
    'guestResolve',
    'Leveltest',
    'toastr'
  ];

  /**
   * Configuring the Leveltest list controller
   */
  function ListLeveltestByGuestController(
    $scope,
    $state,
    $filter,
    guest,
    Leveltest,
    toastr
  ) {

    const vm = this;

    vm.$state = $state;
    vm.guest = guest;
    vm.search = {};
    vm.itemsPerPageNumbers = [5, 10];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Leveltest list
     */
    Leveltest.findByUser(vm.guest._id)
      .then((leveltests) => {
        vm.leveltests = leveltests;
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

      vm.filteredItems = $filter('filter')(vm.leveltests, vm.search);
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

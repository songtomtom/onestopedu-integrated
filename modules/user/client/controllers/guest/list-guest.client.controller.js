(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListGuestController', ListGuestController);

  /**
   * Dependency Injection
   */
  ListGuestController.$inject = [
    '$scope',
    '$filter',
    'Guest',
    'Authentication'
  ];

  /**
   * Configuring the Guest list controller
   */
  function ListGuestController(
    $scope,
    $filter,
    Guest,
    Authentication
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.figureOut = figureOut;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.pageChanged = pageChanged;
    vm.search = {};

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Guest list
     */
    Guest.query((guests) => {
      vm.guests = guests;
      buildPager();
    });

    /**
     * Build page
     */
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      figureOut();
    }

    /**
     * Figure out to display
     */
    function figureOut() {
      vm.filteredItems = $filter('filter')(vm.guests, vm.search);
      vm.filterLength = vm.filteredItems.length;
      const begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      const end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    /**
     * Change page event
     */
    function pageChanged() {
      figureOut();
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


    $scope.$watch('vm.search.providers', (providers) => {
      if (providers === null) {
        delete vm.search.providers;
        figureOut();
      }
    });
  }

}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ListContact1x1Controller', ListContact1x1Controller);

  /**
   * Dependency Injection
   */
  ListContact1x1Controller.$inject = ['$scope', '$filter', 'Contact1x1'];

  /**
   * Configuring the Contact Us list controller
   */
  function ListContact1x1Controller($scope, $filter, Contact1x1) {

    const vm = this;

    vm.search = {};
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Contact us list
     */
    Contact1x1.query((contact1x1s) => {
      vm.contact1x1s = contact1x1s;
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
      vm.filteredItems = $filter('filter')(vm.contact1x1s, vm.search);
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
  }
}());

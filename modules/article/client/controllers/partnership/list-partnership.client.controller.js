(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ListPartnershipController', ListPartnershipController);

  /**
   * Dependency Injection
   */
  ListPartnershipController.$inject = ['$scope', '$filter', 'Partnership'];

  /**
   * Configuring the Partnership list controller
   */
  function ListPartnershipController($scope, $filter, Partnership) {

    const vm = this;

    vm.search = {};
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Partnership list
     */
    Partnership.query((partnerships) => {
      vm.partnerships = partnerships;
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
      vm.filteredItems = $filter('filter')(vm.partnerships, vm.search);
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

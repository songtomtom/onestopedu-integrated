(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('ListPointController', ListPointController);

  /**
   * Dependency Injection
   */
  ListPointController.$inject = ['$scope', '$filter', 'Point', 'Authentication'];

  /**
   * Configuring the Point list controller
   */
  function ListPointController($scope, $filter, Point, Authentication) {

    const vm = this;

    vm.auth = Authentication;
    vm.figureOut = figureOut;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.pageChanged = pageChanged;
    vm.reloadFilter = reloadFilter;
    vm.search = {};

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Point list
     */
    Point.query((points) => {
      vm.points = points;
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
      vm.filteredItems = $filter('filter')(vm.points, vm.search);
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
  }

}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('ListHoldController', ListHoldController);

  /**
   * Dependency Injection
   */
  ListHoldController.$inject = ['$scope', '$filter', 'Hold', 'toastr'];

  /**
   * Configuring the Hold list controller
   */
  function ListHoldController($scope, $filter, Hold, toastr) {


    const vm = this;

    vm.search = {};
    vm.count = {};
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.changeItemsPerPage = changeItemsPerPage;

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      findHoldList();
      initFilter();
      countHold();
    }

    /**
     * Member list
     */
    function findHoldList() {
      Hold.query((holds) => {
        vm.holds = holds;
        buildPager();
      });
    }

    /**
     * Current hold counting
     */
    function countHold() {
      Hold.countHold()
        .then((response) => {
          vm.count.hold = response.count;
        });
    }

    /**
     * Initialize Filter
     */
    function initFilter() {
      vm.search.state = 'hold';
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

      vm.filteredItems = $filter('filter')(vm.holds, vm.search, true);
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

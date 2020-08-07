(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListFinishingMemberController', ListFinishingMemberController);

  /**
   * Dependency Injection
   */
  ListFinishingMemberController.$inject = [
    '$scope',
    '$filter',
    'Course'
  ];

  /**
   * Configuring the Course list controller
   */
  function ListFinishingMemberController(
    $scope,
    $filter,
    Course
  ) {

    const vm = this;

    /**
     * Search filter
     */
    vm.search = {};
    vm.figureOut = figureOut;
    vm.startDate = moment().add(-7, 'days').format('YYYY/MM/DD');
    // vm.endDate = moment().add(7, 'days').format('YYYY/MM/DD');
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.finishingByList = finishingByList;
    vm.pageChanged = pageChanged;
    vm.durationDays = durationDays;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Change item per page number
     */
    function changeItemsPerPage(itemsPerPage) {
      if (itemsPerPage) {
        vm.itemsPerPage = itemsPerPage;
        vm.figureOut();
      }
    }


    finishingByList();
    /**
     * Initialize page items
     */
    function finishingByList() {
      Course.finishingByList({
          started: moment(vm.startDate)
        }).$promise
        .then((finishings) => {
          vm.finishings = finishings;
          buildPager();
        });
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

      vm.filteredItems = $filter('filter')(vm.finishings, vm.search);
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
     * D-day
     */
    function durationDays(ended) {
      return moment(ended).diff(moment(), 'days');
    }
  }

}());

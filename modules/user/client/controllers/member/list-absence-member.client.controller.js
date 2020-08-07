(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListAbsenceMemberController', ListAbsenceMemberController);

  /**
   * Dependency Injection
   */
  ListAbsenceMemberController.$inject = [
    '$scope',
    '$filter',
    'Course'
  ];

  /**
   * Configuring the absence list controller
   */
  function ListAbsenceMemberController(
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
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.absenceByList = absenceByList;
    vm.pageChanged = pageChanged;

    vm.changeItemsPerPage = changeItemsPerPage;

    absenceByList();
    /**
     * Initialize page items
     */
    function absenceByList() {
      Course.absenceByList()
        .$promise
        .then((absences) => {
          vm.absences = absences;
          buildPager();
        });
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

      vm.filteredItems = $filter('filter')(vm.absences, vm.search);
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
  }

}());

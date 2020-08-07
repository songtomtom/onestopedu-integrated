(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListContact1x1ByMemberController', ListContact1x1ByMemberController);

  /**
   * Dependency Injection
   */
  ListContact1x1ByMemberController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$filter',
    'memberResolve',
    'Contact1x1',
    'toastr'
  ];

  /**
   * Configuring the Contact1x1 list controller
   */
  function ListContact1x1ByMemberController(
    $scope,
    $state,
    $window,
    $filter,
    member,
    Contact1x1,
    toastr
  ) {

    const vm = this;

    vm.member = member;
    vm.search = {};
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Contact1x1 list
     */
    Contact1x1.findByMemberId(vm.member._id)
      .then((contact1x1s) => {
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

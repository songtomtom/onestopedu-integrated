(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListPointByMemberController', ListPointByMemberController);

  /**
   * Dependency Injection
   */
  ListPointByMemberController.$inject = [
    '$scope',
    '$filter',
    'memberResolve',
    'Point',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the Coupon and Point list controller
   */
  function ListPointByMemberController(
    $scope,
    $filter,
    member,
    Point,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.member = member;
    vm.figureOut = figureOut;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.pageChanged = pageChanged;
    vm.reloadFilter = reloadFilter;
    vm.search = {};

    vm.changeItemsPerPage = changeItemsPerPage;

    Point.findByMemberId(vm.member._id)
      .then(onFindByMemberPointSuccess)
      .catch(onFindByMemberPointError);

    function onFindByMemberPointSuccess(points) {
      vm.points = points;
      buildPager();
    }

    function onFindByMemberPointError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
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

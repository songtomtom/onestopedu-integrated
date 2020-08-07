(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListMemberController', ListMemberController);

  /**
   * Dependency Injection
   */
  ListMemberController.$inject = [
    '$scope',
    '$filter',
    'Member',
    'Hold',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the Member list controller
   */
  function ListMemberController(
    $scope,
    $filter,
    Member,
    Hold,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.figureOut = figureOut;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.pageChanged = pageChanged;
    vm.search = {};
    vm.count = {};

    vm.changeItemsPerPage = changeItemsPerPage;

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      findMemberList();
      countHold();
    }

    /**
     * Member list
     */
    function findMemberList() {
      Member.query((members) => {
        vm.members = members;
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
      vm.filteredItems = $filter('filter')(vm.members, vm.search);
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

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListCourseByMemberController', ListCourseByMemberController);

  /**
   * Dependency Injection
   */
  ListCourseByMemberController.$inject = [
    '$scope',
    '$state',
    '$filter',
    'memberResolve',
    'Course',
    'toastr'
  ];

  /**
   * Configuring the Course list controller
   */
  function ListCourseByMemberController(
    $scope,
    $state,
    $filter,
    member,
    Course,
    toastr
  ) {


    const vm = this;

    vm.$state = $state;
    vm.search = {};
    vm.member = member;
    vm.itemsPerPageNumbers = [5, 10];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Course list
     */
    Course.findByMemberId(member._id)
      .then((courses) => {
        vm.courses = courses;
        buildPager();
      })
      .catch(onError);

    /**
     * Build page
     */
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOut();
    }

    /**
     * Figure out to display
     */
    function figureOut() {

      vm.filteredItems = $filter('filter')(vm.courses, vm.search);
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

    /**
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }

  }

}());

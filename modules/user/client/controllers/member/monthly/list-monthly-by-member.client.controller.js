(function() {

  angular
    .module('user')
    .controller('ListMonthlyByMemberController', ListMonthlyByMemberController);

  ListMonthlyByMemberController.$inject = [
    '$scope',
    '$window',
    '$filter',
    '$state',
    'memberResolve',
    'Monthly',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the monthly evaluation list controller
   * @param       {[type]} $scope         [description]
   * @param       {[type]} $window        [description]
   * @param       {[type]} $filter        [description]
   * @param       {[type]} Monthly [description]
   * @param       {[type]} Authentication    [description]
   * @param       {[type]} toastr         [description]
   * @constructor
   */
  function ListMonthlyByMemberController(
    $scope,
    $window,
    $filter,
    $state,
    member,
    Monthly,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.$state = $state;
    vm.member = member;

    vm.search = {};
    vm.itemsPerPageNumbers = [5, 10];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.auth = Authentication;
    vm.attachNames = attachNames;

    vm.changeItemsPerPage = changeItemsPerPage;


    Monthly.findByMemberId(vm.member._id)
      .then((monthlies) => {
        vm.monthlies = monthlies;
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
      vm.filteredItems = $filter('filter')(vm.monthlies, vm.search);
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
     * Attach tutors name
     */
    function attachNames(tutors) {
      let tutorNames = '';
      tutors.forEach((tutor, index) => {
        if (index > 0) {
          tutorNames += `${tutor.nickName}, `;
        }
      });
      return tutorNames.slice(0, -2);
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

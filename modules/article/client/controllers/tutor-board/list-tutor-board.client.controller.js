(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ListTutorBoardController', ListTutorBoardController);

  /**
   * Dependency Injection
   */
  ListTutorBoardController.$inject = [
    '$scope',
    '$state',
    '$filter',
    'Tutor',
    'TutorBoard',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the Daily Report list controller
   */
  function ListTutorBoardController(
    $scope,
    $state,
    $filter,
    Tutor,
    TutorBoard,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.search = {};
    vm.auth = Authentication;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;
    vm.attachNames = attachNames;
    // vm.tutors = Tutor.query();
    vm.refresh = refresh;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * TutorBoard list
     */
    TutorBoard.query((tutorBoards) => {
      vm.tutorBoards = tutorBoards;
      buildPager();
    });


    $scope.$watch('vm.search.tutors.nation', (nation) => {

      if (angular.isUndefined(nation)) {
        return false;
      }

      if (!nation || nation === '') {
        vm.search = {};
        vm.tutors = [];
        if (vm.tutorBoards.length > 0) {
          vm.figureOut();
        }
        return false;
      }

      Tutor.nationByList({
          nation
        })
        .$promise
        .then((tutors) => {
          vm.tutors = tutors;
        })
        .catch(onError);
    });

    /**
     * Refresh
     */
    function refresh() {
      $state.reload();
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
      vm.filteredItems = $filter('filter')(vm.tutorBoards, vm.search);
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
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
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

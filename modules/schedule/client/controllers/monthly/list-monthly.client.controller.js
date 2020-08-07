(function() {

  angular
    .module('schedule')
    .controller('ListMonthlyController', ListMonthlyController);

  ListMonthlyController.$inject = [
    '$scope',
    '$window',
    '$filter',
    'Monthly',
    'Authentication',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the monthly evaluation list controller
   */
  function ListMonthlyController(
    $scope,
    $window,
    $filter,
    Monthly,
    Authentication,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.search = {};
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;
    vm.getDurationDays = getDurationDays;
    vm.diffDays = diffDays;
    vm.auth = Authentication;
    vm.attachNames = attachNames;

    vm.changeSearchMonth = changeSearchMonth;
    vm.changeItemsPerPage = changeItemsPerPage;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);


    initialize();

    function initialize() {
      initDatePickerOptions();
    }

    function initDatePickerOptions() {
      vm.datetimePickerOptions.format = 'YYYY/MM';
      vm.datetimePickerOptions.viewMode = 'months';
    }

    function changeSearchMonth(searched) {

      if (!searched) {
        return false;
      }

      Monthly.findByMonth(searched)
        .then(onFindMonthlySuccess)
        .catch(onFindMonthlyError);


      function onFindMonthlySuccess(monthlies) {
        vm.monthlies = monthlies;
        buildPager();
      }

      function onFindMonthlyError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
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
     * D-day
     */
    function getDurationDays(ended) {
      return moment(ended).diff(moment(), 'days');
    }

    /**
     * D-day
     */
    function diffDays(x, y) {
      return moment(x).diff(moment(y), 'days');
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
  }

}());

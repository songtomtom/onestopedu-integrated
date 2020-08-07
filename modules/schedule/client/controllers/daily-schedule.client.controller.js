(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('DailyScheduleController', DailyScheduleController);

  /**
   * Dependency Injection
   */
  DailyScheduleController.$inject = [
    '$scope',
    '$filter',
    '$window',
    'Authentication',
    'Schedule',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the daily controller
   */
  function DailyScheduleController(
    $scope,
    $filter,
    $window,
    Authentication,
    Schedule,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.auth = Authentication;
    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    vm.changeItemsPerPage = changeItemsPerPage;

    initialize();

    function initialize() {
      initDatePickerOptions();
    }

    function initDatePickerOptions() {
      vm.datetimePickerOptions.format = 'YYYY/MM/DD';
      vm.datetimePickerOptions.viewMode = 'days';
    }

    $scope.$watch('vm.searchDay', (day) => {
      if (angular.isUndefined(day)) {
        return false;
      }

      Schedule.findByDay(day)
        .then((schedules) => {
          vm.schedules = schedules;
          buildPager();
        })
        .catch(onError);
    });

    /**
     * Error callback
     */
    function onError(err) {
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

      vm.filteredItems = $filter('filter')(vm.schedules, vm.search);
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

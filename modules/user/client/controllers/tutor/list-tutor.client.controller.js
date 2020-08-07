(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ListTutorController', ListTutorController);

  /**
   * Dependency Injection
   */
  ListTutorController.$inject = ['$scope', '$filter', 'Tutor'];

  /**
   * Configuring the Tutor list controller
   */
  function ListTutorController($scope, $filter, Tutor) {

    const vm = this;

    vm.search = {};
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;
    vm.convertTimezone = convertTimezone;
    vm.reloadFilter = reloadFilter;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Filter reload
     */
    function reloadFilter() {
      vm.search = {};
      vm.figureOut();
    }

    /**
     * Tutor list
     */
    Tutor.query((tutors) => {
      vm.tutors = tutors;
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
      vm.filteredItems = $filter('filter')(vm.tutors, vm.search);
      vm.filterLength = vm.filteredItems.length;
      const begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      const end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
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
     * Change page event
     */
    function pageChanged() {
      vm.figureOut();
    }

    /**
     * Convert timezone
     */
    function convertTimezone(timezone) {
      return moment().tz(timezone).format('YYYY/MM/DD. HH:mm | z Z');
    }
  }

}());

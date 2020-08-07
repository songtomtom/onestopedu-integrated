(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ListEventBannerController', ListEventBannerController);

  /**
   * Dependency Injection
   */
  ListEventBannerController.$inject = ['$scope', '$filter', 'Notice'];

  /**
   * Configuring the Notice list controller
   */
  function ListEventBannerController($scope, $filter, Notice) {

    const vm = this;

    vm.search = {};
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * Notice list
     */
    Notice.query((eventBanners) => {
      vm.eventBanners = eventBanners;
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
      vm.filteredItems = $filter('filter')(vm.eventBanners, vm.search);
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

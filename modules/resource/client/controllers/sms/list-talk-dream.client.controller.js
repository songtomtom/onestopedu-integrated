(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('ListTalkDreamController', ListTalkDreamController);

  /**
   * Dependency Injection
   */
  ListTalkDreamController.$inject = ['$scope', '$filter', 'TalkDream', 'Authentication'];

  /**
   * Configuring the TalkDream list controller
   */
  function ListTalkDreamController($scope, $filter, TalkDream, Authentication) {

    const vm = this;

    vm.auth = Authentication;
    vm.figureOut = figureOut;
    vm.itemsPerPageNumbers = [15, 30, 50, 100];
    vm.pageChanged = pageChanged;
    vm.reloadFilter = reloadFilter;
    vm.search = {};

    vm.changeItemsPerPage = changeItemsPerPage;

    /**
     * TalkDream list
     */
    TalkDream.query((talkDreams) => {
      vm.talkDreams = talkDreams;
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
      vm.filteredItems = $filter('filter')(vm.talkDreams, vm.search);
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

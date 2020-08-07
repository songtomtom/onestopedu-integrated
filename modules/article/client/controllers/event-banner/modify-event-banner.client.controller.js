(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ModifyEventBannerController', ModifyEventBannerController);

  /**
   * Dependency Injection
   */
  ModifyEventBannerController.$inject = [
    '$scope',
    '$window',
    '$state',
    'eventBannerResolve',
    'FileItem',
    'Authentication',
    'summernoteConfig',
    'toastr'
  ];

  /**
   * Configuring the Notice edit controller
   */
  function ModifyEventBannerController(
    $scope,
    $window,
    $state,
    eventBanner,
    FileItem,
    Authentication,
    summernoteConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.eventBanner = eventBanner;
    vm.summernoteOptions = summernoteConfig;


  }
}());

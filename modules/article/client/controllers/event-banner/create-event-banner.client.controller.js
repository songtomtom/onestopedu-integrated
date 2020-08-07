(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('CreateEventBannerController', CreateEventBannerController);

  /**
   * Dependency Injection
   */
  CreateEventBannerController.$inject = [
    '$scope',
    '$window',
    '$state',
    'eventBannerResolve',
    'FileItem',
    'Upload',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the Notice write controller
   */
  function CreateEventBannerController(
    $scope,
    $window,
    $state,
    eventBanner,
    FileItem,
    Upload,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;

    vm.eventBanner = eventBanner;
    vm.cancelFile = cancelFile;
    vm.create = create;

    function cancelFile() {

    }

    function create() {

    }


  }
}());

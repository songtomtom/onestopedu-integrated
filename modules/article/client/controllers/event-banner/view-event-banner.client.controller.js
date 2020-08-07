(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ViewEventBannerController', ViewEventBannerController);

  /**
   * Dependency Injection
   */
  ViewEventBannerController.$inject = ['$scope', '$window', '$state', 'eventBannerResolve', 'toastr'];

  /**
   * Configuring the Notice read controller
   */
  function ViewEventBannerController($scope, $window, $state, eventBanner, toastr) {

    const vm = this;

    vm.eventBanner = eventBanner;
    vm.remove = remove;
    vm.isImage = isImage;

    function isImage(mimetype) {
      return mimetype.indexOf('image') !== -1;
    }

    /**
     * Remove Notice
     */
    function remove() {

      /**
       * Remove eventBanner
       */
      if ($window.confirm('Are you sure you want to remove this eventBanner?')) {
        vm.eventBanner.$remove(onNoticeRemoveSuccess, onError);
      }
    }

    /**
     * Notice update success callback
     */
    function onNoticeRemoveSuccess() {
      toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      $state.go('homepage.event-banner.list');
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

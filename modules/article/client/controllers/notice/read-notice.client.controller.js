(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ReadNoticeController', ReadNoticeController);

  /**
   * Dependency Injection
   */
  ReadNoticeController.$inject = ['$scope', '$window', '$state', 'noticeResolve', 'toastr'];

  /**
   * Configuring the Notice read controller
   */
  function ReadNoticeController($scope, $window, $state, notice, toastr) {

    const vm = this;

    vm.notice = notice;
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
       * Remove notice
       */
      if ($window.confirm('Are you sure you want to remove this notice?')) {
        vm.notice.$remove(onNoticeRemoveSuccess, onError);
      }
    }

    /**
     * Notice update success callback
     */
    function onNoticeRemoveSuccess() {
      toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      $state.go('cs-center.notice.list');
    }

    /**
     * Error callback
     */
    function onError(err) {
      /**
       * Error notification
       */
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }
  }
}());

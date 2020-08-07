(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ModifyGuestController', ModifyGuestController);

  /**
   * Dependency Injection
   */
  ModifyGuestController.$inject = [
    '$scope',
    '$window',
    '$state',
    'guestResolve',
    'toastr'
  ];

  /**
   * Configuring the Guest modify controller
   */
  function ModifyGuestController(
    $scope,
    $window,
    $state,
    guest,
    toastr
  ) {

    const vm = this;

    vm.guest = guest;
    vm.modify = modify;

    /**
     * Modify Guest
     */
    function modify(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.guestForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this guest information?')) {
        vm.guest.$update(onReload, onError);
      }
    }

    /**
     * Reload callback
     */
    function onReload() {
      toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      $state.reload();
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

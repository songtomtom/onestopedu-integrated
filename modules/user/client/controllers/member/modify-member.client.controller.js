(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ModifyMemberController', ModifyMemberController);

  /**
   * Dependency Injection
   */
  ModifyMemberController.$inject = [
    '$scope',
    '$window',
    '$state',
    'memberResolve',
    'toastr'
  ];

  /**
   * Configuring the Member modify controller
   */
  function ModifyMemberController(
    $scope,
    $window,
    $state,
    member,
    toastr
  ) {

    const vm = this;

    vm.member = member;
    vm.modify = modify;

    /**
     * Modify Member
     */
    function modify(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.memberForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this member information?')) {
        vm.member.$update(onReload, onError);
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

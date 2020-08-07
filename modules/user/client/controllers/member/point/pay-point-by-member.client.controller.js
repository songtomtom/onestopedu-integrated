(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('PayPointByMemberController', PayPointByMemberController);

  /**
   * Dependency Injection
   */
  PayPointByMemberController.$inject = [
    '$scope',
    '$window',
    '$state',
    'pointResolve',
    'memberResolve',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the pay point controller
   */
  function PayPointByMemberController(
    $scope,
    $window,
    $state,
    point,
    member,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.point = point;
    vm.member = member;
    vm.payPoint = payPoint;

    /**
     * Pay point
     */
    function payPoint(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pointForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to pay this point?')) {
        vm.point.payer = vm.auth.user._id;
        vm.point.user = vm.member._id;
        vm.point.providers = vm.member.providers;
        vm.point.pastPoint = vm.member.point;
        vm.point.$save({
            memberId: vm.member._id
          })
          .then(onSavePointSuccess)
          .catch(onSavePointError);
      }

      // Save point success callback
      function onSavePointSuccess() {
        $state.go('member.view.point.list', {}, {
          reload: true
        });
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      }

      // Save point error callback
      function onSavePointError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }
}());

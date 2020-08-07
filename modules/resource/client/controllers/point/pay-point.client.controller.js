(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('PayPointController', PayPointController);

  /**
   * Dependency Injection
   */
  PayPointController.$inject = [
    '$scope',
    '$window',
    '$state',
    'pointResolve',
    'Member',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the pay point controller
   */
  function PayPointController(
    $scope,
    $window,
    $state,
    point,
    Member,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.point = point;
    vm.figureOutMember = figureOutMember;
    vm.payPoint = payPoint;

    /**
     * Figure out Member to display
     */
    function figureOutMember() {
      Member.findByProviders(vm.point.providers)
        .then(onFindMemberSuccess)
        .catch(onFindMemberError);

      // Find point success callback
      function onFindMemberSuccess(members) {
        vm.members = members;
      }

      // Find point error callback
      function onFindMemberError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

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
        vm.point.pastPoint = vm.member.point;
        vm.point.$save({
            memberId: vm.member._id
          })
          .then(onSavePointSuccess)
          .catch(onSavePointError);
      }

      // Save point success callback
      function onSavePointSuccess() {
        $state.go('resource.point.list');
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

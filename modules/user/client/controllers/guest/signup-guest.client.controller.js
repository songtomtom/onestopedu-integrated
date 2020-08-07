(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('SignupGuestController', SignupGuestController);

  /**
   * Dependency Injection
   */
  SignupGuestController.$inject = [
    '$scope',
    '$window',
    '$state',
    'guestResolve',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the Guest signup controller
   */
  function SignupGuestController(
    $scope,
    $window,
    $state,
    guest,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.guest = guest;
    vm.auth = Authentication;
    vm.signup = signup;

    if (angular.isDefined(vm.guest)) {
      vm.guest.age = 'student';
    }

    /**
     * Guest Sign up
     */
    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.guestForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to sign up this guest?')) {
        vm.guest.$signup(onState, onError);
      }
    }

    /**
     * Go state callback
     */
    function onState() {
      toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      $state.go('guest.list');
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

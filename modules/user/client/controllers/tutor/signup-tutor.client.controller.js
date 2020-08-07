(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('SignupTutorController', SignupTutorController);

  /**
   * Dependency Injection
   */
  SignupTutorController.$inject = ['$scope', '$window', '$state', 'tutorResolve', 'toastr'];

  /**
   * Configuring the tutor signup controller
   */
  function SignupTutorController($scope, $window, $state, tutor, toastr) {

    const vm = this;

    vm.tutor = tutor;
    vm.convertTimezone = convertTimezone;
    vm.signup = signup;

    /**
     * Sign up
     */
    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tutorForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to sign up this tutor?')) {

        vm.tutor.passowrd = '1234';
        vm.tutor.$signup()
          .then(() => {
            toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
            $state.go('tutor.list');
          })
          .catch(onError);
      }
    }

    /**
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }

    /**
     * Convert timezone
     */
    function convertTimezone(timezone) {
      return moment().tz(timezone).format('HH:mm | z');
    }

  }

}());

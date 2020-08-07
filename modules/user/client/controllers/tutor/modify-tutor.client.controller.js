(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ModifyTutorController', ModifyTutorController);

  /**
   * Dependency Injection
   */
  ModifyTutorController.$inject = ['$scope', '$window', '$state', 'toastr'];

  /**
   * Configuring the Tutor modify controller
   */
  function ModifyTutorController($scope, $window, $state, toastr) {

    const vm = this;

    vm.modify = modify;
    vm.convertTimezone = convertTimezone;

    /**
     * listen for the event in the $scope
     */
    $scope.$on('tp:tutor.open', (e, tutor) => {
      vm.tutor = tutor;
    });

    /**
     * Modify Tutor
     */
    function modify(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tutorForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this tutor information?')) {
        vm.tutor.$update()
          .then(() => {
            toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
            $state.reload();
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

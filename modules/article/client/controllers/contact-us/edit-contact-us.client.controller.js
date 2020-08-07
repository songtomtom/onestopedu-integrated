(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('EditContactUsController', EditContactUsController);

  /**
   * Dependency Injection
   */
  EditContactUsController.$inject = [
    '$scope',
    '$window',
    '$state',
    'contactUsResolve',
    'Authentication',
    'summernoteConfig',
    'toastr'
  ];

  /**
   * Configuring the ContactUs edit controller
   */
  function EditContactUsController(
    $scope,
    $window,
    $state,
    contactUs,
    Authentication,
    summernoteConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.edit = edit;
    vm.contactUs = contactUs;
    vm.summernoteOptions = summernoteConfig;

    /**
     * ContactUs Edit
     */
    function edit(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contactUsForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to edit this contact us?')) {
        contactUs.$update()
          .then(onUpdateContactUsSuccess)
          .catch(onUpdateContactUsError);
      }

      // ContactUs update success callback
      function onUpdateContactUsSuccess(contactUs) {
        $state.go('cs-center.contact-us.read', {
          contactUsId: contactUs._id
        });
      }

      // ContactUs update success callback
      function onUpdateContactUsError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }
}());

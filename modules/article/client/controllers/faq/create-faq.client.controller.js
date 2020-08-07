(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('CreateFAQController', CreateFAQController);

  /**
   * Dependency Injection
   */
  CreateFAQController.$inject = [
    '$scope',
    '$window',
    '$state',
    'faqResolve',
    'Authentication',
    'summernoteConfig',
    'toastr'
  ];

  /**
   * Configuring the FAQ Write controller
   */
  function CreateFAQController(
    $scope,
    $window,
    $state,
    faq,
    Authentication,
    summernoteConfig,
    toastr
  ) {

    const vm = this;

    vm.faq = faq;
    vm.auth = Authentication;
    vm.create = create;
    vm.summernoteOptions = summernoteConfig;

    /**
     * Write FAQ
     */
    function create(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.faqForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to create this FAQ?')) {
        vm.faq.user = vm.auth.user._id;
        vm.faq.$save()
          .then(onSaveFAQSuccess)
          .catch(onSaveFAQError);
      }

      /**
       * Save FAQ Success callback
       */
      function onSaveFAQSuccess() {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('cs-center.faq.list');
      }

      /**
       * Error callback
       */
      function onSaveFAQError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }
}());

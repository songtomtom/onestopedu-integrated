(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ModifyFAQController', ModifyFAQController);

  /**
   * Dependency Injection
   */
  ModifyFAQController.$inject = [
    '$scope',
    '$window',
    '$state',
    'faqResolve',
    'summernoteConfig',
    'toastr'
  ];

  /**
   * Configuring the FAQ Write controller
   */
  function ModifyFAQController(
    $scope,
    $window,
    $state,
    faq,
    summernoteConfig,
    toastr
  ) {

    const vm = this;

    vm.faq = faq;
    vm.modify = modify;
    vm.remove = remove;
    vm.summernoteOptions = summernoteConfig;

    /**
     * Remove FAQ
     */
    function remove() {
      if ($window.confirm('Are you sure you want to remove this FAQ?')) {
        vm.faq.$remove()
          .then(onRemoveFAQSuccess)
          .catch(onRemoveFAQError);
      }

      /**
       * Remove FAQ Success callback
       */
      function onRemoveFAQSuccess(faq) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('cs-center.faq.list');
      }

      /**
       * Error callback
       */
      function onRemoveFAQError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Modify FAQ
     */
    function modify(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.faqForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this FAQ?')) {
        vm.faq.$update()
          .then(onUpdateFAQSuccess)
          .catch(onUpdateFAQError);
      }

      /**
       * Update FAQ Success callback
       */
      function onUpdateFAQSuccess(faq) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('cs-center.faq.view', {
          faqId: faq._id
        });
      }

      /**
       * Error callback
       */
      function onUpdateFAQError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }
}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('ModifyProductController', ModifyProductController);

  /**
   * Dependency Injection
   */
  ModifyProductController.$inject = [
    '$scope',
    '$window',
    '$state',
    'productResolve',
    'toastr'
  ];

  /**
   * Configuring the Product modify controller
   */
  function ModifyProductController(
    $scope,
    $window,
    $state,
    product,
    toastr
  ) {

    const vm = this;

    vm.product = product;
    vm.modify = modify;

    /**
     * Modify Product
     */
    function modify(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this product?')) {
        vm.product.$update()
          .then(onUpdateProductSuccess)
          .catch(onUpdateProductError);
      }
    }

    /**
     * Update product success callback
     */
    function onUpdateProductSuccess() {
      $state.reload();
      toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
    }

    /**
     * Update product error callback
     */
    function onUpdateProductError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }

  }

}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('SigninController', SigninController);

  /**
   * Dependency Injection
   */
  SigninController.$inject = [
    '$scope',
    '$location',
    '$window',
    'User',
    'Authentication',
    'toastr'
  ];

  /**
   * Sign in controller
   *
   * @param       {[type]} User
   * @param       {[type]} Authentication
   * @param       {[type]} toastr
   * @constructor
   */
  function SigninController(
    $scope,
    $location,
    $window,
    User,
    Authentication,
    toastr
  ) {

    const vm = this;

    /**
     * Get an eventual error defined in the URL query string:
     */
    if ($location.search().err) {
      toastr.error($location.search().err, 'Error', {
        timeOut: 0
      });
    }

    vm.auth = Authentication;
    vm.backgroundImageName = getBackgroundImageName();

    /**
     * Sign in
     *
     * @param  {Boolean} isValid Form validation result
     */
    vm.signin = function(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userForm');
        return false;
      }

      /**
       * Sign in
       */
      User.signin(vm.credentials).$promise
        .then(onSuccess)
        .catch(onError);
    };

    /**
     * Sign in success callback
     *
     * @param  {[Object]} user
     */
    function onSuccess(user) {
      // If successful we assign the response to the global user model
      vm.auth.user = user;
      // And redirect to the previous or home page
      $window.location.reload();
    }

    /**
     * Error callback
     *
     * @param  {[Object]} err
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }

    /**
     * Geneate random(1 ~ 17) number and Sign in background image name
     *
     * @return {[String]} Background image name
     */
    function getBackgroundImageName() {
      return `/modules/user/client/img/login-bg/login-bg-${Math.floor(Math.random() * 17) + 1}.jpg`;
    }
  }
}());

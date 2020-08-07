(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  /**
   * Dependency Injection
   */
  HeaderController.$inject = ['Authentication'];

  /**
   * Configuring the header controller
   */
  function HeaderController(Authentication) {

    const vm = this;
    vm.auth = Authentication;
  }

}());

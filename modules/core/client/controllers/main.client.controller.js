(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .controller('MainController', MainController);

  /**
   * Dependency Injection
   */
  MainController.$inject = ['$state', '$rootScope', '$scope'];

  /**
   * Configuring the main controller
   */
  function MainController($state, $rootScope, $scope) {

    const vm = this;

    vm.$state = $state;
  }

}());

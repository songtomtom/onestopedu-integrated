(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .controller('HomeController', HomeController);

  /**
   * Dependency Injection
   */
  HomeController.$inject = ['$scope'];

  /**
   * Configuring the home controller
   */
  function HomeController($scope) {
    const vm = this;
  }

}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ViewTutorController', ViewTutorController);

  /**
   * Dependency Injection
   */
  ViewTutorController.$inject = ['$scope'];

  /**
   * Configuring the Tutor view controller
   */
  function ViewTutorController($scope) {

    const vm = this;

  }

}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('inbox')
    .controller('InboxController', InboxController);

  /**
   * Dependency Injection
   */
  InboxController.$inject = ['$scope'];

  /**
   * Configuring the Inbox controller
   */
  function InboxController($scope) {

    const vm = this;


  }

}());

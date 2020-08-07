(function() {

  /**
   * Module Configuration
   */
  angular
    .module('inbox')
    .controller('ListNotificationInboxController', ListNotificationInboxController);

  /**
   * Dependency Injection
   */
  ListNotificationInboxController.$inject = ['$scope', 'Notification'];

  /**
   * Configuring the Inbox controller
   */
  function ListNotificationInboxController($scope, Notification) {

    const vm = this;

    vm.notifications = Notification.query();
    vm.from = from;

    function from(created) {
      return moment(created).from();
    }


  }

}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('inbox.services')
    .factory('Notification', Notification);

  /**
   * Dependency Injection
   */
  Notification.$inject = ['$resource'];

  /**
   * Notification service for REST endpoint
   */
  function Notification($resource) {
    const Notification = $resource('/api/notification/:notificationId', {
      notificationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Notification, {
      success: function(notification) {
        notification.notificationType = 'success';
        return this.save(notification).$promise;
      }
    });

    return Notification;

  }
}());

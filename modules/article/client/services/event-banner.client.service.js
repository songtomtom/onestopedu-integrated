(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.services')
    .factory('EventBanner', EventBanner);

  /**
   * Dependency Injection
   */
  EventBanner.$inject = ['$resource'];

  /**
   * Event Banner service for REST endpoint
   */
  function EventBanner($resource) {
    return $resource('/api/event-banner/:eventBannerId', {
      eventBannerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

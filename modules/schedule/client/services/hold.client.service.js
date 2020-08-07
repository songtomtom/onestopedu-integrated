(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.services')
    .factory('Hold', Hold);

  /** Dependency Injection */
  Hold.$inject = ['$resource'];

  /**
   * Hold service for REST end hold
   */
  function Hold($resource) {
    const service = $resource('/api/hold/:holdId', {
      holdId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      count: {
        method: 'POST',
        url: '/api/hold/count'
      }
    });

    angular.extend(service, {
      countHold
    });

    return service;

    /** Count hold */
    function countHold() {
      return this.count()
        .$promise;
    }

  }
}());

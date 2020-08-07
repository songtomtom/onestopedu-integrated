(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.services')
    .factory('Surem', Surem);

  /**
   * Dependency Injection
   */
  Surem.$inject = ['$resource'];

  /**
   * SUREM SMS transport service
   */
  function Surem($resource) {
    const service = $resource('/api/surem', {}, {
      sendSMS: {
        method: 'POST',
        url: '/api/surem/sms'
      },
      sendLMS: {
        method: 'POST',
        url: '/api/surem/lms'
      }
    });

    angular.extend(service, {
      send
    });

    function send(surem) {
      if (surem.suremType === 'SMS') {
        return this.sendSMS(surem)
          .$promise;
      } else {
        return this.sendLMS(surem)
          .$promise;
      }
    }


    return service;
  }
}());

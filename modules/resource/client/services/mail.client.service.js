(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.services')
    .factory('Mail', Mail);

  /**
   * Dependency Injection
   */
  Mail.$inject = ['$resource'];

  /**
   * E-mail resource service for REST
   */
  function Mail($resource) {
    const service = $resource('/api/mail', {}, {
      sendToTemplateByAssessment: {
        method: 'GET',
        url: '/api/mail/send/assessment/:userId',
        params: {
          userId: '='
        }
      }
    });

    angular.extend(service, {
      sendToLeveltestAssessment
    });

    return service;

    /**
     * Send to leveltest assessment
     */
    function sendToLeveltestAssessment(userId) {
      return this.sendToTemplateByAssessment({
        userId
      }).$promise;
    }
  }
}());

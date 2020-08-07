(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .factory('AuthInterceptor', AuthInterceptor);

  /**
   * Dependency Injection
   */
  AuthInterceptor.$inject = ['$q', '$injector', 'Authentication'];

  /**
   * Configuring authentication interceptor service
   */
  function AuthInterceptor($q, $injector, Authentication) {
    const service = {
      responseError
    };

    return service;

    function responseError(rejection) {
      if (!rejection.config.ignoreAuthModule) {
        switch (rejection.status) {
          case 400:
            {
              $injector.get('$state').go('bad-request', {
                message: rejection.data.message
              });
              break;
            }
          case 401:
            {
              Authentication.user = null;
              $injector.get('$state').transitionTo('home');
              break;
            }
          case 403:
            {
              $injector.get('$state').transitionTo('forbidden');
              break;
            }
          case 404:
            {
              $injector.get('$state').go('not-found', {
                message: rejection.data.message
              });
              break;
            }
          case -1:
            {

              /**
               * Handle error if no response from server(Network Lost or Server not responding)
               */
              const toastr = $injector.get('toastr');
              toastr.error('No response received from server. Please try again later.', 'Error processing request!', {
                timeOut: 0
              });
              break;
            }
        }
      }

      /**
       * Otherwise, default behaviour
       */
      return $q.reject(rejection);
    }
  }
}());

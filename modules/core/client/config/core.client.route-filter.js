(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .run(routeFilter);

  /**
   * Dependency Injection
   */
  routeFilter.$inject = ['$rootScope', '$state', '$timeout', 'Authentication'];

  /**
   * Setting up route filter
   */
  function routeFilter($rootScope, $state, $timeout, Authentication) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeStart(event, toState, toParams, fromState, fromParams) {

      /**
       * Check authentication before changing state
       */
      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        let allowed = false;
        for (let i = 0, roles = toState.data.roles; i < roles.length; i += 1) {
          if ((roles[i] === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(roles[i]) !== -1)) {
            allowed = true;
            break;
          }
        }

        if (!allowed) {
          event.preventDefault();
          if (Authentication.user !== null && typeof Authentication.user === 'object') {
            $state.transitionTo('forbidden');
          } else {
            $state.go('home')
              .then(() => {

                // Record previous state
                storePreviousState(toState, toParams);
              });
          }
        }
      }
    }

    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      // Record previous state
      storePreviousState(fromState, fromParams);

      $timeout(() => {
        angular.element('html, body').animate({
          scrollTop: angular.element('body').offset().top
        }, 500);
      });

    }

    /**
     * Store previous state
     */
    function storePreviousState(state, params) {
      // Only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state,
          params,
          href: $state.href(state, params)
        };
      }
    }
  }
}());

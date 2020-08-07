(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.routes')
    .config(routeConfig);

  /**
   * Dependency Injection
   */
  routeConfig.$inject = ['$stateProvider'];

  /**
   * Setting up route
   */
  function routeConfig($stateProvider) {

    $stateProvider
      .state('tutor', {
        abstract: true,
        url: '/tutor',
        template: '<ui-view/>'
      })
      .state('tutor.list', {
        url: '/list',
        templateUrl: 'modules/user/client/views/tutor/list-tutor.client.view.html',
        controller: 'ListTutorController',
        controllerAs: 'vm'
      })
      .state('tutor.signup', {
        url: '/signup',
        templateUrl: 'modules/user/client/views/tutor/signup-tutor.client.view.html',
        controller: 'SignupTutorController',
        controllerAs: 'vm',
        resolve: {
          tutorResolve: newTutor
        }
      });

    /**
     * Dependency Injection
     */
    newTutor.$inject = ['Tutor'];

    /**
     * New Tutor resolve
     */
    function newTutor(Tutor) {
      return new Tutor();
    }
  }

}());

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
      .state('guest', {
        abstract: true,
        url: '/guest',
        template: '<ui-view/>'
      })
      .state('guest.view', {
        abstract: true,
        url: '/:guestId/view',
        controller: 'ViewGuestController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/guest/view-guest.client.view.html',
        resolve: {
          guestResolve: getGuest
        },
        data: {
          pageContentFullHeight: true,
          pageContentFullWidth: true
        }
      })
      .state('guest.view.modify', {
        url: '/modify',
        controller: 'ModifyGuestController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/guest/modify-guest.client.view.html',
        resolve: {
          guestResolve: getGuest
        }
      })


      .state('guest.view.leveltest', {
        abstract: true,
        url: '/leveltest',
        template: '<ui-view/>'
      })
      .state('guest.view.leveltest.regist', {
        url: '/regist',
        templateUrl: 'modules/user/client/views/guest/leveltest/regist-leveltest-by-guest.client.view.html',
        controller: 'RegistLeveltestByGuestController',
        controllerAs: 'vm',
        resolve: {
          leveltestResolve: newLeveltest,
          guestResolve: getGuest
        }
      })
      .state('guest.view.leveltest.list', {
        url: '/list',
        controller: 'ListLeveltestByGuestController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/guest/leveltest/list-leveltest-by-guest.client.view.html',
        resolve: {
          guestResolve: getGuest
        }
      })
      .state('guest.view.leveltest.list.detail', {
        url: '/:leveltestId/detail',
        controller: 'DetailGuestLeveltestController',
        controllerAs: 'vm',
        templateUrl: 'modules/schedule/client/views/leveltest/guest/detail-guest-leveltest.client.view.html',
        resolve: {
          leveltestResolve: getLeveltest,
          assessmentResolve: getAssessment,
          commentResolve: newComment
        }
      })

      .state('guest.list', {
        url: '/list',
        templateUrl: 'modules/user/client/views/guest/list-guest.client.view.html',
        controller: 'ListGuestController',
        controllerAs: 'vm'
      })
      .state('guest.signup', {
        url: '/signup',
        templateUrl: 'modules/user/client/views/guest/signup-guest.client.view.html',
        controller: 'SignupGuestController',
        controllerAs: 'vm',
        resolve: {
          guestResolve: newGuest
        }
      });

    /**
     * Dependency Injection
     */
    newGuest.$inject = ['Guest'];

    /**
     * New Guest resolve
     */
    function newGuest(Guest) {
      return new Guest();
    }

    /**
     * Dependency Injection
     */
    getGuest.$inject = ['$stateParams', 'Guest'];

    /**
     * Get Guest resolve
     */
    function getGuest($stateParams, Guest) {
      return Guest.get({
        guestId: $stateParams.guestId
      }).$promise;
    }

    /**
     * Dependency Injection
     */
    getLeveltest.$inject = ['$stateParams', 'Leveltest'];

    /**
     * Get Leveltest resolve
     */
    function getLeveltest($stateParams, Leveltest) {
      return Leveltest.get({
        leveltestId: $stateParams.leveltestId
      }).$promise;
    }

    /**
     * Dependency Injection
     */
    getCourse.$inject = ['$stateParams', 'Course'];

    /**
     * Get Course resolve
     */
    function getCourse($stateParams, Course) {
      return Course.get({
        courseId: $stateParams.courseId
      }).$promise;
    }

    /**
     * Dependency Injection
     */
    getAssessment.$inject = ['$stateParams', 'Leveltest', 'Assessment'];

    /**
     * Get Assessment resolve
     */
    function getAssessment($stateParams, Leveltest, Assessment) {
      return Leveltest.get({
          leveltestId: $stateParams.leveltestId
        }).$promise
        .then((leveltest) => {
          return Assessment.get({
            assessmentId: leveltest.assessment._id
          }).$promise;
        });
    }

    /**
     * Dependency Injection
     */
    newComment.$inject = ['Comment'];

    /**
     * New Commnet resolve
     */
    function newComment(Comment) {
      return new Comment();
    }

    /**
     * Dependency Injection
     */
    newLeveltest.$inject = ['Leveltest'];

    /**
     * New Leveltest resolve
     */
    function newLeveltest(Leveltest) {
      return new Leveltest();
    }
  }

}());

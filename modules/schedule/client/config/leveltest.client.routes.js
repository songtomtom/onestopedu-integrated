(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.routes')
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
      .state('schedule.leveltest', {
        abstract: true,
        url: '/leveltest',
        template: '<ui-view/>'
      })
      .state('schedule.leveltest.list', {
        url: '/list',
        templateUrl: 'modules/schedule/client/views/leveltest/list-leveltest.client.view.html',
        controller: 'ListLeveltestController',
        controllerAs: 'vm'
      })
      .state('schedule.leveltest.member', {
        abstract: true,
        url: '/member',
        template: '<ui-view/>'
      })
      .state('schedule.leveltest.member.apply', {
        url: '/apply',
        templateUrl: 'modules/schedule/client/views/leveltest/member/apply-member-leveltest.client.view.html',
        controller: 'ApplyMemberLeveltestController',
        controllerAs: 'vm',
        resolve: {
          leveltestResolve: newLeveltest
        }
      })
      .state('schedule.leveltest.member.regist', {
        url: '/regist',
        templateUrl: 'modules/schedule/client/views/leveltest/member/regist-member-leveltest.client.view.html',
        controller: 'RegistMemberLeveltestController',
        controllerAs: 'vm',
        resolve: {
          leveltestResolve: newLeveltest
        }
      })

      .state('schedule.leveltest.guest', {
        abstract: true,
        url: '/guest',
        template: '<ui-view/>'
      })
      .state('schedule.leveltest.guest.apply', {
        url: '/apply',
        templateUrl: 'modules/schedule/client/views/leveltest/guest/apply-guest-leveltest.client.view.html',
        controller: 'ApplyGuestLeveltestController',
        controllerAs: 'vm',
        resolve: {
          leveltestResolve: newLeveltest,
          guestResolve: newGuest
        }
      })
      .state('schedule.leveltest.guest.regist', {
        url: '/regist',
        templateUrl: 'modules/schedule/client/views/leveltest/guest/regist-guest-leveltest.client.view.html',
        controller: 'RegistGuestLeveltestController',
        controllerAs: 'vm',
        resolve: {
          leveltestResolve: newLeveltest,
          guestResolve: newGuest
        }
      });

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

    /**
     * Dependency Injection
     */
    newMember.$inject = ['Member'];

    /**
     * New member resolve
     */
    function newMember(Member) {
      return new Member();
    }

    /**
     * Dependency Injection
     */
    newGuest.$inject = ['Guest'];

    /**
     * New guest resolve
     */
    function newGuest(Guest) {
      return new Guest();
    }
  }

}());

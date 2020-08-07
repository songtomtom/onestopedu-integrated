(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.routes')
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
      .state('resource.textbook', {
        abstract: true,
        url: '/textbook',
        template: '<ui-view/>'
      })
      .state('resource.textbook.list', {
        url: '/list',
        templateUrl: 'modules/resource/client/views/textbook/list-textbook.client.view.html',
        controller: 'ListTextbookController',
        controllerAs: 'vm'
      })
      .state('resource.textbook.modify', {
        url: '/:textbookId/modify',
        templateUrl: 'modules/resource/client/views/textbook/modify-textbook.client.view.html',
        controller: 'ModifyTextbookController',
        controllerAs: 'vm',
        resolve: {
          textbookResolve: getTextbook
        }
      })
      .state('resource.textbook.add', {
        url: '/add',
        templateUrl: 'modules/resource/client/views/textbook/add-textbook.client.view.html',
        controller: 'AddTextbookController',
        controllerAs: 'vm',
        resolve: {
          textbookResolve: newTextbook
        }
      });

    /**
     * Dependency Injection
     */
    getTextbook.$inject = ['$stateParams', 'Textbook'];

    /**
     * Get Textbook resource resolve
     */
    function getTextbook($stateParams, Textbook) {
      return Textbook.get({
        textbookId: $stateParams.textbookId
      }).$promise;
    }

    /**
     * Dependency Injection
     */
    newTextbook.$inject = ['Textbook'];

    /**
     * New Textbook resource resolve
     */
    function newTextbook(Textbook) {
      return new Textbook();
    }

  }

}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.routes')
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
      .state('cs-center.contact-1x1', {
        abstract: true,
        url: '/contact-1x1',
        template: '<ui-view/>'
      })
      .state('cs-center.contact-1x1.list', {
        url: '/list',
        templateUrl: 'modules/article/client/views/contact-1x1/list-contact-1x1.client.view.html',
        controller: 'ListContact1x1Controller',
        controllerAs: 'vm'
      })
      .state('cs-center.contact-1x1.read', {
        url: '/:contact1x1Id/read',
        templateUrl: 'modules/article/client/views/contact-1x1/read-contact-1x1.client.view.html',
        controller: 'ReadContact1x1Controller',
        controllerAs: 'vm',
        resolve: {
          contact1x1Resolve: getContact1x1,
          commentResolve: newComment
        }
      });

    /** Dependency Injection */
    getContact1x1.$inject = ['$stateParams', 'Contact1x1'];

    /**
     * Get Contact1x1 resolve
     */
    function getContact1x1($stateParams, Contact1x1) {
      return Contact1x1.get({
        contact1x1Id: $stateParams.contact1x1Id
      }).$promise;
    }

    /** Dependency Injection */
    newComment.$inject = ['Comment'];

    /**
     * New Commnet resolve
     */
    function newComment(Comment) {
      return new Comment();
    }
  }
}());

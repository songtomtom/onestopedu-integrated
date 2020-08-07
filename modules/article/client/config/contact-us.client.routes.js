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
      .state('cs-center.contact-us', {
        abstract: true,
        url: '/contact-us',
        template: '<ui-view/>'
      })
      .state('cs-center.contact-us.list', {
        url: '/list',
        templateUrl: 'modules/article/client/views/contact-us/list-contact-us.client.view.html',
        controller: 'ListContactUsController',
        controllerAs: 'vm'
      })
      .state('cs-center.contact-us.read', {
        url: '/:contactUsId/read',
        templateUrl: 'modules/article/client/views/contact-us/read-contact-us.client.view.html',
        controller: 'ReadContactUsController',
        controllerAs: 'vm',
        resolve: {
          contactUsResolve: getContactUs,
          commentResolve: newComment
        }
      })
      .state('cs-center.contact-us.edit', {
        url: '/:contactUsId/edit',
        templateUrl: 'modules/article/client/views/contact-us/edit-contact-us.client.view.html',
        controller: 'EditContactUsController',
        controllerAs: 'vm',
        resolve: {
          contactUsResolve: getContactUs
        }
      });

    /** Dependency Injection */
    getContactUs.$inject = ['$stateParams', 'ContactUs'];

    /**
     * Get Contact Us resolve
     */
    function getContactUs($stateParams, ContactUs) {
      return ContactUs.get({
        contactUsId: $stateParams.contactUsId
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

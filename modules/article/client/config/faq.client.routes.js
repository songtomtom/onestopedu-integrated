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
      .state('cs-center.faq', {
        abstract: true,
        url: '/faq',
        template: '<ui-view/>'
      })
      .state('cs-center.faq.create', {
        url: '/create',
        templateUrl: 'modules/article/client/views/faq/create-faq.client.view.html',
        controller: 'CreateFAQController',
        controllerAs: 'vm',
        resolve: {
          faqResolve: newFAQ
        }
      })
      .state('cs-center.faq.modify', {
        url: '/:faqId/modify',
        templateUrl: 'modules/article/client/views/faq/modify-faq.client.view.html',
        controller: 'ModifyFAQController',
        controllerAs: 'vm',
        resolve: {
          faqResolve: getFAQ
        }
      })
      .state('cs-center.faq.list', {
        url: '/list',
        templateUrl: 'modules/article/client/views/faq/list-faq.client.view.html',
        controller: 'ListFAQController',
        controllerAs: 'vm'
      });

    /** Dependency Injection */
    getFAQ.$inject = ['$stateParams', 'FAQ'];

    /**
     * Get FAQ resolve
     */
    function getFAQ($stateParams, FAQ) {
      return FAQ.get({
        faqId: $stateParams.faqId
      }).$promise;
    }

    /** Dependency Injection */
    newFAQ.$inject = ['FAQ'];

    /**
     * New FAQ resolve
     */
    function newFAQ(FAQ) {
      return new FAQ();
    }
  }

}());

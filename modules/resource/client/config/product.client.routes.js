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
      .state('resource.product', {
        abstract: true,
        url: '/product',
        template: '<ui-view/>'
      })
      .state('resource.product.list', {
        url: '/list',
        templateUrl: 'modules/resource/client/views/product/list-product.client.view.html',
        controller: 'ListProductController',
        controllerAs: 'vm'
      })
      .state('resource.product.modify', {
        url: '/:productId/modify',
        templateUrl: 'modules/resource/client/views/product/modify-product.client.view.html',
        controller: 'ModifyProductController',
        controllerAs: 'vm',
        resolve: {
          productResolve: getProduct
        }
      });

    /**
     * Dependency Injection
     */
    getProduct.$inject = ['$stateParams', 'Product'];

    /**
     * Get Product resource resolve
     */
    function getProduct($stateParams, Product) {
      return Product.get({
        productId: $stateParams.productId
      }).$promise;
    }

  }

}());

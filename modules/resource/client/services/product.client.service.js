(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.services')
    .factory('Product', Product);

  /**
   * Dependency Injection
   */
  Product.$inject = ['$resource'];

  /**
   * Product resource service for REST end product
   */
  function Product($resource) {
    const service = $resource('/api/product/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(service, {
      find
    });

    return service;

    /**
     * Find product list
     */
    function find() {
      return this.query()
        .$promise;
    }
  }
}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .filter('unsafe', unsafe);

  /**
   * Dependency Injection
   */
  unsafe.$inject = ['$sce'];

  /**
   * Unsafe html bind
   */
  function unsafe($sce) {
    return (input) => {
      return $sce.trustAsHtml(input);
    };
  }

}());

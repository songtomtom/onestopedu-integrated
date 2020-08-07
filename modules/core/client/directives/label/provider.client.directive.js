(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('provider', provider);

  /**
   * Dependency Injection
   */
  provider.$inject = ['$interpolate'];

  /**
   * Directive for label provider
   */
  function provider($interpolate) {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    /**
     * Directive link
     */
    function link(scope, element) {
      const provider = $interpolate(element.text())(scope);
      element.addClass(`label label-${provider}`);
      element.text(provider.charAt(0).toUpperCase() + provider.slice(1));
    }
  }
}());

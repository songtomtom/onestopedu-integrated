(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('today', today);

  /**
   * Dependency Injection
   */
  today.$inject = ['$timeout', '$interpolate'];

  /**
   * Directive for label today
   */
  function today($timeout, $interpolate) {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    /**
     * Directive link
     */
    function link(scope, elem) {
      const date = $interpolate(elem.text())(scope);
      if (moment().format('YYYYMMDD') === moment(date).format('YYYYMMDD')) {
        elem.addClass('text-danger f-w-700');
      }
    }
  }
}());

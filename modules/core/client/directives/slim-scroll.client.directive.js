(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('slimScroll', slimScroll);

  /**
   * Dependency Injection
   */
  slimScroll.$inject = ['$timeout'];

  /**
   * Directive for slimScroll with custom height
   */
  function slimScroll($timeout) {
    const directive = {
      restrict: 'A',
      scope: {
        boxHeight: '@'
      },
      link
    };

    return directive;


    function link(scope, elem) {
      $timeout(() => {
        elem.slimScroll({
          height: `${scope.boxHeight}px` || '100px',
          railOpacity: 0.9
        });
      });
    }
  }
}());

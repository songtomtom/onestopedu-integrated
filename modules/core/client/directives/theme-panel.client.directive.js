(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('themePanel', themePanel);

  /** Dependency Injection */
  themePanel.$inject = ['$window'];

  /**
   * Directive for menual mobile
   */
  function themePanel($window) {

    const directive = {
      restrict: 'C',
      link
    };


    return directive;

    function link(scope, elem) {
      elem.css('top', angular.element(document).scrollTop());
      angular.element($window).bind('scroll', (e) => {
        elem.css('top', angular.element(document).scrollTop());
      });

    }
  }
}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('a', a);

  /**
   * Directive click to "a" tag
   */
  function a() {

    const directive = {
      restrict: 'E',
      link
    };

    return directive;

    function link(scope, elem, attrs) {
      if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
        elem.on('click', (e) => {
          e.preventDefault();
        });
      }

    }
  }
}());

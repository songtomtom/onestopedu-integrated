(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('uppercase', uppercase);

  /**
   * Users directive used to force uppercase input
   */
  function uppercase() {
    const directive = {
      require: 'ngModel',
      link
    };

    return directive;

    function link(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push((input) => {
        return input ? input.toUpperCase() : '';
      });
      element.css('text-transform', 'uppercase');
    }
  }
}());

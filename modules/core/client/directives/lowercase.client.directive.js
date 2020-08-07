(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('lowercase', lowercase);

  /**
   * Users directive used to force lowercase input
   */
  function lowercase() {
    const directive = {
      require: 'ngModel',
      link
    };

    return directive;

    function link(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push((input) => {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  }
}());

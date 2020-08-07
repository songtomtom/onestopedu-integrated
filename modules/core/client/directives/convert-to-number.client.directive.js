(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('convertToNumber', convertToNumber);

  /**
   * Directive number conver to string
   */
  function convertToNumber() {

    const directive = {
      require: 'ngModel',
      link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      ngModel.$parsers.push((val) => {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push((val) => {
        return `${val}`;
      });
    }
  }
}());

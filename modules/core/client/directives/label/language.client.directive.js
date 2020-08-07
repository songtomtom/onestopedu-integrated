(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('language', language);

  /**
   * Dependency Injection
   */
  language.$inject = ['$interpolate'];

  /**
   * Directive for label language
   */
  function language($interpolate) {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    function link(scope, element) {

      const language = $interpolate(element.text())(scope);
      if (language === 'english') {
        // English
        element.addClass('label label-primary');
      } else if (language === 'chinese') {
        // Chinese
        element.addClass('label label-danger');
      }

      // Capitalize
      element.text(language.charAt(0).toUpperCase() + language.slice(1));

    }

  }

}());

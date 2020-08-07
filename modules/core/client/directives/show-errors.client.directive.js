(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('showErrors', showErrors);

  /**
   * Dependency Injection
   */
  showErrors.$inject = ['$timeout', '$interpolate'];

  /**
   * Directive show error
   */
  function showErrors($timeout, $interpolate) {
    const directive = {
      compile,
      restrict: 'A',
      require: '^form'
    };

    return directive;

    function compile(element, attrs) {
      if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
        if (!(element.hasClass('form-group') || element.hasClass('input-group'))) {
          throw new Error('show-errors element does not have the \'form-group\' or \'input-group\' class');
        }
      }
      return linkFn;

      function linkFn(scope, element, attrs, formCtrl) {
        $timeout(() => {
          const options = scope.$eval(attrs.showErrors) || {};
          const showSuccess = options.showSuccess || false;
          const inputElement = element[0].querySelector('.form-control[name]') || element[0].querySelector('[name]');
          const inputNgElement = angular.element(inputElement);
          const inputName = $interpolate(inputNgElement.attr('name') || '')(scope);
          let initCheck = false;
          let showValidationMessages = false;

          if (!inputName) {
            throw new Error('show-errors element has no child input elements with a \'name\' attribute class');
          }

          scope.$watch(() => {
            return formCtrl[inputName] && formCtrl[inputName].$invalid;
          }, toggleClasses);

          scope.$on('show-errors-check-validity', checkValidity);
          scope.$on('show-errors-reset', reset);


          function checkValidity(event, name) {
            if (angular.isUndefined(name) || formCtrl.$name === name) {
              initCheck = true;
              showValidationMessages = true;

              return toggleClasses(formCtrl[inputName].$invalid);
            }
          }

          function reset(event, name) {
            if (angular.isUndefined(name) || formCtrl.$name === name) {
              return $timeout(() => {
                element.removeClass('has-error');
                element.removeClass('has-success');
                showValidationMessages = false;
              }, 0, false);
            }
          }

          function toggleClasses(invalid) {
            element.toggleClass('has-error', showValidationMessages && invalid);

            if (showSuccess) {
              return element.toggleClass('has-success', showValidationMessages && !invalid);
            }
          }
        });
      }
    }
  }
}());

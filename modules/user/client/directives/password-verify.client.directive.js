(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .directive('passwordVerify', passwordVerify);

  /**
   * Configuring password verify directive
   */
  function passwordVerify() {
    const directive = {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      const status = true;
      scope.$watch(() => {
        let combined;
        if (scope.passwordVerify || ngModel) {
          combined = `${scope.passwordVerify}_${ngModel}`;
        }
        return combined;
      }, (value) => {
        if (value) {
          ngModel.$validators.passwordVerify = passwordVerify;
        }

        function passwordVerify(password) {
          const origin = scope.passwordVerify;
          return (origin === password);
        }
      });
    }
  }
}());

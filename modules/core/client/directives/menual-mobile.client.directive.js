(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('menualMobile', menualMobile);

  /**
   * Dependency Injection
   */
  menualMobile.$inject = ['$rootScope', '$interpolate'];

  /**
   * Directive for menual mobile
   */
  function menualMobile($rootScope, $interpolate) {

    const directive = {
      restrict: 'A',
      transclude: true,
      scope: {
        _id: '=menualMobile'
      },
      template: '<button class="btn btn-white btn-xs"><i class="fa fa-mobile"></i> {{mobile | mobile}}</button>',
      link
    };


    return directive;

    function link(scope, elem, attrs, ctrl, trans) {

      trans((transElem, transScope) => {
        scope.mobile = $interpolate(transElem.text())(transScope);
      });

      elem.on('click', (e) => {
        $rootScope.$broadcast('open-small-mobile', scope._id);
      });

    }
  }
}());

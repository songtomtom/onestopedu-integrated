(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('sidebarNavigation', sidebarNavigation);

  /**
   * Dependency Injection
   */
  sidebarNavigation.$inject = ['$timeout'];

  /**
   * Directive used to set metisMenu
   */
  function sidebarNavigation($timeout) {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    function link(scope, elem) {

      $timeout(() => {
        angular.element(document).ready(() => {
          const expandTime = (angular.element('.sidebar').attr('data-disable-slide-animation')) ? 0 : 250;

          angular.element('.sidebar .nav > .has-sub > a').click(function() {
            const target = angular.element(this).next('.sub-menu');
            const otherMenu = angular.element('.sidebar .nav > li.has-sub > .sub-menu').not(target);

            if (angular.element('.page-sidebar-minified').length === 0) {
              angular.element(otherMenu).closest('li').addClass('closing');
              angular.element(otherMenu).slideUp(expandTime, function() {
                angular.element(otherMenu).closest('li').addClass('closed').removeClass('expand closing');
              });
              if (angular.element(target).is(':visible')) {
                angular.element(target).closest('li').addClass('closing').removeClass('expand');
              } else {
                angular.element(target).closest('li').addClass('expanding').removeClass('closed');
              }
              angular.element(target).slideToggle(expandTime, function() {
                const targetLi = angular.element(this).closest('li');
                if (!angular.element(target).is(':visible')) {
                  angular.element(targetLi).addClass('closed');
                  angular.element(targetLi).removeClass('expand');
                } else {
                  angular.element(targetLi).addClass('expand');
                  angular.element(targetLi).removeClass('closed');
                }
                angular.element(targetLi).removeClass('expanding closing');
              });
            }
          });


          angular.element('.sidebar .nav > .has-sub .sub-menu li.has-sub > a').click(function() {
            if (angular.element('.page-sidebar-minified').length === 0) {
              const target = angular.element(this).next('.sub-menu');
              if (angular.element(target).is(':visible')) {
                angular.element(target).closest('li').addClass('closing').removeClass('expand');
              } else {
                angular.element(target).closest('li').addClass('expanding').removeClass('closed');
              }
              angular.element(target).slideToggle(expandTime, function() {
                const targetLi = angular.element(this).closest('li');
                if (!angular.element(target).is(':visible')) {
                  angular.element(targetLi).addClass('closed');
                  angular.element(targetLi).removeClass('expand');
                } else {
                  angular.element(targetLi).addClass('expand');
                  angular.element(targetLi).removeClass('closed');
                }
                angular.element(targetLi).removeClass('expanding closing');
              });
            }
          });
        });
      });
    }
  }

}());

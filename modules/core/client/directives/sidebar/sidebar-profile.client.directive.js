(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('sidebarProfile', sidebarProfile);

  /**
   * Directive used to set metisMenu
   */
  function sidebarProfile() {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    function link(scope, elem) {

      const expandTime = (angular.element('.sidebar').attr('data-disable-slide-animation')) ? 0 : 250;

      elem.click((e) => {
        e.preventDefault();

        const targetLi = angular.element(this).closest('li');
        const targetProfile = angular.element('.sidebar .nav.nav-profile');
        const targetClass = 'active';
        const targetExpandingClass = 'expanding';
        const targetExpandClass = 'expand';
        const targetClosingClass = 'closing';
        const targetClosedClass = 'closed';

        if (angular.element(targetProfile).is(':visible')) {
          angular.element(targetLi).removeClass(targetClass);
          angular.element(targetProfile).removeClass(targetClosingClass);
        } else {
          angular.element(targetLi).addClass(targetClass);
          angular.element(targetProfile).addClass(targetExpandingClass);
        }
        angular.element(targetProfile).slideToggle(expandTime, function() {
          if (!angular.element(targetProfile).is(':visible')) {
            angular.element(targetProfile).addClass(targetClosedClass);
            angular.element(targetProfile).removeClass(targetExpandClass);
          } else {
            angular.element(targetProfile).addClass(targetExpandClass);
            angular.element(targetProfile).removeClass(targetClosedClass);
          }
          angular.element(targetProfile).removeClass(`${targetExpandingClass} ${targetClosingClass}`);
        });
      });
    }
  }

}());

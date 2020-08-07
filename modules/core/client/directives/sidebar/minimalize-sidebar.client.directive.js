(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('minimalizeSidebar', minimalizeSidebar);

  /**
   * Directive used to set minimalize button
   */
  function minimalizeSidebar() {

    const directive = {
      link,
      restrict: 'A'
    };

    return directive;

    function link(scope, elem) {
      angular.element(document).on('click', '[data-click=sidebar-minify]', function(e) {
        e.preventDefault();
        const sidebarClass = 'page-sidebar-minified';
        const targetContainer = '#page-container';

        if (angular.element(targetContainer).hasClass(sidebarClass)) {
          angular.element(targetContainer).removeClass(sidebarClass);
        } else {
          angular.element(targetContainer).addClass(sidebarClass);

          if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            angular.element('#sidebar [data-scrollbar="true"]').css('margin-top', '0');
            angular.element('#sidebar [data-scrollbar="true"]').css('overflow-x', 'scroll');
          }
        }
        angular.element(window).trigger('resize');
      });
    }
  }
}());

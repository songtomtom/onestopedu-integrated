(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('scrollTop', scrollTop);

  /**
   * Directive for scroll top
   */
  function scrollTop() {
    const directive = {
      restrict: 'A',
      link
    };

    return directive;


    function link(scope, elem) {

      angular.element(document).scroll(function() {
        const totalScroll = angular.element(document).scrollTop();

        if (totalScroll >= 200) {
          elem.addClass('show');
        } else {
          elem.removeClass('show');
        }
      });

      elem.click(function(e) {
        e.preventDefault();
        angular.element('html, body').animate({
          scrollTop: angular.element('body').offset().top
        }, 500);
      });
    }
  }
}());

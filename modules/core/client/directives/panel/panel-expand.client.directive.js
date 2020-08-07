(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('panelExpand', panelExpand);

  /**
   * Directive expand to panel
   */
  function panelExpand() {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    function link(scope, elem) {


      /**
       * Hover
       */
      elem.hover(function(e) {
        if (!elem.attr('data-init')) {
          elem.tooltip({
            title: 'Expand / Compress',
            placement: 'bottom',
            trigger: 'hover',
            container: 'body'
          });
          elem.tooltip('show');
        }
      });

      /**
       * Click
       */
      elem.click(function(e) {

        e.preventDefault();
        const target = elem.closest('.panel');
        const targetBody = angular.element(target).find('.panel-body');
        let targetTop = 40;
        if (angular.element(targetBody).length !== 0) {
          const targetOffsetTop = angular.element(target).offset().top;
          const targetBodyOffsetTop = angular.element(targetBody).offset().top;
          targetTop = targetBodyOffsetTop - targetOffsetTop;
        }

        if (angular.element('body').hasClass('panel-expand') && angular.element(target).hasClass('panel-expand')) {
          angular.element('body, .panel').removeClass('panel-expand');
          angular.element('.panel').removeAttr('style');
          angular.element(targetBody).removeAttr('style');
        } else {
          angular.element('body').addClass('panel-expand');
          elem.closest('.panel').addClass('panel-expand');

          if (angular.element(targetBody).length !== 0 && targetTop !== 40) {
            let finalHeight = 40;
            angular.element(target).find(' > *').each(function() {
              const targetClass = elem.attr('class');

              if (targetClass !== 'panel-heading' && targetClass !== 'panel-body') {
                finalHeight += elem.height() + 30;
              }
            });
            if (finalHeight !== 40) {
              angular.element(targetBody).css('top', `${finalHeight}px`);
            }
          }
        }
        angular.element(window).trigger('resize');
      });
    }
  }

}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('panelReload', panelReload);

  /**
   * Directive reload to panel
   */
  function panelReload() {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    function link(scope, elem) {

      elem.click((e) => {
        elem.tooltip('hide');
      });

      elem.hover((e) => {
        elem.tooltip({
          title: 'Reload',
          placement: 'bottom',
          trigger: 'hover',
          container: 'body'
        });
      });
    }
  }

}());

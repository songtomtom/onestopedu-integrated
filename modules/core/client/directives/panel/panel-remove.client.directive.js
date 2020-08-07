(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('panelRemove', panelRemove);

  /**
   * Directive remove to panel
   */
  function panelRemove() {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    function link(scope, elem) {

      /**
       * hover
       */
      elem.hover(function(e) {
        elem.tooltip({
          title: 'Remove',
          placement: 'bottom',
          trigger: 'hover',
          container: 'body'
        });
        elem.tooltip('show');
      });

      /**
       * Click
       */
      elem.click(function(e) {
        e.preventDefault();
        elem.tooltip('dispose');
        elem.closest('.panel').remove();
      });
    }
  }

}());

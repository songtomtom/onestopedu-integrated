(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('panelCollapse', panelCollapse);

  /**
   * Directive collapse to panel
   */
  function panelCollapse() {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    function link(scope, elem) {

      /**
       * Hover
       */
      elem.hover((e) => {
        elem.tooltip({
          title: 'Collapse / Expand',
          placement: 'bottom',
          trigger: 'hover',
          container: 'body'
        });
        elem.tooltip('show');
      });

      /**
       * Click
       */
      elem.click((e) => {
        e.preventDefault();
        elem
          .closest('.panel')
          .find('.panel-body')
          .slideToggle();
      });

    }
  }

}());

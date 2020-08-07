(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('externalEvents', externalEvents);

  /**
   * Dependency Injection
   */
  externalEvents.$inject = ['$timeout'];

  /**
   * Directive for Custom bootstrap
   */
  function externalEvents($timeout) {
    const directive = {
      restrict: 'A',
      link
    };

    return directive;


    function link(scope, elem) {

      $('.fc-event').each(function() {
        $(this).data('event', {
          title: $.trim($(this).text()), // use the element's text as the event title
          stick: true, // maintain when user navigates (see docs on the renderEvent method)
          color: ($(this).attr('data-color')) ? $(this).attr('data-color') : '',
          duration: '00:10:00'
        });
        $(this).draggable({
          zIndex: 999,
          revert: true, // will cause the event to go back to its
          revertDuration: 0 //  original position after the drag
        });
      });

    }
  }
}());

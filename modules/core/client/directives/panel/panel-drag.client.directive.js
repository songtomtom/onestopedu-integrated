(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('panelDrag', panelDrag);

  /**
   * Directive drag to panel
   */
  function panelDrag() {

    const directive = {
      restrict: 'A',
      link,
      controller
    };

    return directive;

    function link(scope, elem) {

      angular.element(document).ready(() => {

        const target = $('.panel:not([panel-sortable="false"])').parent('[class*=col]');
        const targetHandle = '.panel-heading';
        const connectedTarget = '.row > [class*=col]';

        $(target).sortable({
          handle: targetHandle,
          connectWith: connectedTarget,
          stop(event, ui) {
            ui.item.find('.panel-title').append('<i class="fa fa-refresh fa-spin m-l-5" data-id="title-spinner"></i>');
            scope.handleSavePanelPosition(ui.item);
          }
        });
      });

    }

    function controller($scope) {
      $scope.handleSavePanelPosition = function(element) {
        if ($('.ui-sortable').length !== 0) {
          const newValue = [];
          let index = 0;
          $.when($('.ui-sortable').each(function() {
            const panelSortableElement = $(this).find('[panel-sortable-id]');
            if (panelSortableElement.length !== 0) {
              const columnValue = [];
              $(panelSortableElement).each(function() {
                const targetSortId = $(this).attr('panel-sortable-id');
                columnValue.push({
                  id: targetSortId
                });
              });
              newValue.push(columnValue);
            } else {
              newValue.push([]);
            }
            index += 1;
          })).done(function() {
            let targetPage = window.location.href;
            targetPage = targetPage.split('?');
            targetPage = targetPage[0];
            localStorage.setItem(targetPage, JSON.stringify(newValue));
            $(element).find('[data-id="title-spinner"]').delay(500).fadeOut(500, function() {
              $(this).remove();
            });
          });
        }
      };
    }
  }

}());

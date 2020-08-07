(function() {

  /** Module Configuration */
  angular
    .module('core')
    .constant('timelineCalendarConfig', {
      calendar: {
        defaultView: 'timelineDay',
        displayEventTime: true,
        droppable: true,
        editable: true,
        eventDurationEditable: false,
        eventLimit: true,
        header: {
          center: 'title',
          left: 'timelineDay',
          right: 'prev,today,next '
        },
        height: 800,
        groupByResource: true,
        // minTime: '09:00:00',
        navLinks: true,
        nowIndicator: true,
        resourceAreaWidth: '10%',
        resourceGroupField: 'groupId',
        schedulerLicenseKey: '0730394876-fcs-1531921860',
        selectable: true,
        selectHelper: true,
        slotDuration: '00:10:00',
        slotEventOverlap: true,
        slotLabelFormat: 'H:mm',
        slotLabelInterval: '00:05:00',
        slotWidth: 100,
        weekends: false
      }
    });
}());

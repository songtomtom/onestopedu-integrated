(function() {

  /** Module Configuration */
  angular
    .module('core')
    .constant('verticalResourceCalendarConfig', {
      calendar: {
        defaultView: 'agendaWeek',
        displayEventTime: true,
        droppable: true,
        editable: true,
        // eventDurationEditable: false,
        eventLimit: true,
        header: {
          center: 'title',
          left: 'month,agendaWeek,agendaDay',
          right: 'prev,today,next '
        },
        // minTime: '09:00:00',
        navLinks: true,
        nowIndicator: true,
        schedulerLicenseKey: '0730394876-fcs-1531921860',
        selectable: true,
        selectHelper: true,
        // slotDuration: '00:05:00',
        // slotEventOverlap: true,
        // slotLabelFormat: 'H:mm',
        // slotLabelInterval: '00:05:00',
        slotWidth: 100,
        weekends: false
      }
    });
}());

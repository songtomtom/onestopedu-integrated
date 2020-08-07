(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('MyCalendarScheduleController', MyCalendarScheduleController);

  /**
   * Dependency Injection
   */
  MyCalendarScheduleController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$filter',
    'Schedule',
    'Authentication',
    'uiCalendarConfig',
    'toastr'
  ];

  /**
   * Configuring the Daily controller
   */
  function MyCalendarScheduleController(
    $scope,
    $state,
    $window,
    $filter,
    Schedule,
    Authentication,
    uiCalendarConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.uiConfig = {
      calendar: {
        // height: 800,
        editable: false,
        eventDurationEditable: false,
        schedulerLicenseKey: '0730394876-fcs-1531921860',
        header: {
          left: 'month,agendaWeek,agendaDay',
          center: 'title',
          right: 'prev,today,next '
          // right: 'agendaWeek, agendaDay, timelineDay'
        },
        slotDuration: '00:10:00',
        slotEventOverlap: true,
        slotWidth: 100,
        droppable: true,
        weekends: false,
        navLinks: true,
        slotLabelInterval: '00:05:00',
        defaultView: 'agendaWeek',
        displayEventTime: false,
        eventLimit: true,
        slotLabelFormat: 'H:mm',
        nowIndicator: true
      }
    };

    /**
     * Full calendar events
     */
    vm.eventSources = [{
      url: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic',
      className: 'gcal-event',
      currentTimezone: 'America/Chicago'
    }, eventsFunction];


    /**
     * Event source that calls a function on every view switch
     */
    function eventsFunction(start, end, timezone, callback) {

      let promise;
      if (vm.auth.user.roles[0] === 'tutor') {
        promise = Schedule.tutorByList({
          tutorId: vm.auth.user._id
        }).$promise;
      } else {
        promise = Schedule.query().$promise;
      }


      promise
        .then((schedules) => {

          const events = schedules.map((schedule) => {
            return {
              scheduleId: schedule._id,
              title: schedule.user.koreanName,
              state: schedule.state,
              start: moment(schedule.started).tz(vm.auth.user.timezone),
              end: moment(schedule.ended).tz(vm.auth.user.timezone),
              category: schedule.scheduleType,
              color: schedule.color,
              borderColor: schedule.borderColor,
              allDay: (schedule.scheduleType === 'monthly')
            };

          });

          callback(events);

        })
        .catch(onError);
    }

    /**
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }

  }

}());

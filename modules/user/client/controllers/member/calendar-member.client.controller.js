(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('CalendarMemberController', CalendarMemberController);

  /**
   * Dependency Injection
   */
  CalendarMemberController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$filter',
    'memberResolve',
    'Schedule',
    'Authentication',
    // 'uiCalendarConfig',
    'toastr'
  ];

  /**
   * Configuring the Daily controller
   */
  function CalendarMemberController(
    $scope,
    $state,
    $window,
    $filter,
    member,
    Schedule,
    Authentication,
    // uiCalendarConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.member = member;

    vm.uiConfig = {
      calendar: {
        height: 800,
        editable: true,
        eventDurationEditable: false,
        schedulerLicenseKey: '0730394876-fcs-1531921860',
        header: {
          left: 'month,agendaWeek,agendaDay',
          center: 'title',
          right: 'prev,today,next '
          // right: 'agendaWeek, agendaDay, timelineDay'
        },
        minTime: '09:00:00',
        // slotDuration: '00:05:00',
        // slotLabelInterval: '00:05:00',
        slotEventOverlap: true,
        slotLabelFormat: 'H:mm',
        slotWidth: 100,
        droppable: true,
        weekends: false,
        navLinks: true,
        defaultView: 'agendaWeek',
        displayEventTime: true,
        eventLimit: true,
        nowIndicator: true,
        eventClick
      }
    };

    function eventClick(event, allDay, jsEvent, view) {
      // let params;
      // if (this.scheduleType === 'lesson') {
      //   params = {
      //     lessonId: event.scheduleId
      //   };
      // } else if (this.scheduleType === 'leveltest') {
      //   params = {
      //     leveltestId: event.scheduleId
      //   };
      // } else {
      //   params = {
      //     monthlyId: event.scheduleId
      //   };
      // }
      //
      // $state.go('member.view.' + event.scheduleType + '.list.detail', params);
    }

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

      Schedule.findByMemberId(vm.member._id)
        .then(onFindScheduleSuccess)
        .catch(onFindScheduleError);

      function onFindScheduleSuccess(schedules) {
        const events = schedules.map((schedule) => {
          return {
            scheduleId: schedule._id,
            title: schedule.title,
            state: schedule.state,
            scheduleType: schedule.scheduleType,
            start: moment(schedule.started).clone()
              .tz(vm.auth.user.timezone),
            end: moment(schedule.ended).clone()
              .tz(vm.auth.user.timezone),
            category: schedule.scheduleType,
            color: schedule.eventColor,
            borderColor: schedule.eventColor,
            allDay: schedule.scheduleType === 'monthly'
          };
        });

        callback(events);
      }

      function onFindScheduleError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }
}());

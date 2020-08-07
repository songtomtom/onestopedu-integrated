(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('CalendarScheduleController', CalendarScheduleController);

  /**
   * Dependency Injection
   */
  CalendarScheduleController.$inject = [
    '$scope',
    '$state',
    '$window',
    '$filter',
    'Tutor',
    'Schedule',
    'uiCalendarConfig',
    'toastr'
  ];

  /**
   * Configuring the Daily controller
   */
  function CalendarScheduleController(
    $scope,
    $state,
    $window,
    $filter,
    Tutor,
    Schedule,
    uiCalendarConfig,
    toastr
  ) {

    const vm = this;
    vm.tutors = Tutor.query();
    vm.renderNation = renderNation;
    vm.startHour = 9;
    vm.endHour = 24;

    vm.uiConfig = {
      calendar: {
        // height: 800,
        editable: true,
        eventDurationEditable: false,
        schedulerLicenseKey: '0730394876-fcs-1531921860',
        header: {
          left: 'agendaWeek,agendaDay',
          center: 'title',
          right: 'prev,today,next '
          // right: 'agendaWeek, agendaDay, timelineDay'
        },
        groupByResource: true,
        slotDuration: '00:10:00',
        slotEventOverlap: true,
        slotWidth: 100,
        minTime: '09:00:00',
        // maxTime: vm.maxTime,
        weekends: false,
        navLinks: true,
        slotLabelInterval: '00:05:00',
        // allDayDefault: true,
        defaultView: 'agendaWeek',
        // googleCalendarApiKey: '35289373171-fojkf1dllu98ooelnnrtd5qdskbe2h4a.apps.googleusercontent.com',
        // eventClick,
        eventDrop,
        resources: resourcesFunction,
        // resourceGroupField: 'groupId',
        displayEventTime: true,
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


    function renderNation(nation) {
      vm.nation = nation;
      Tutor.nationByList({
          nation: vm.nation
        }).$promise
        .then((tutors) => {
          vm.selectTutors = tutors.map((tutor) => {
            return tutor._id;
          });
        })
        .catch(onError);
    }


    $scope.$watch('vm.startHour', (startHour) => {

      if (startHour >= vm.endHour) {
        return false;
      }

      if (startHour && uiCalendarConfig.calendars.calendar) {
        uiCalendarConfig.calendars.calendar.fullCalendar('option', 'minTime', `${startHour}:00:00`);
      }
    });


    $scope.$watch('vm.endHour', (endHour) => {

      if (endHour <= vm.startHour) {
        return false;
      }


      if (endHour && uiCalendarConfig.calendars.calendar) {
        uiCalendarConfig.calendars.calendar.fullCalendar('option', 'maxTime', `${endHour}:00:00`);
      }
    });


    $scope.$watch('vm.selectTutors', (selectTutors) => {

      if (angular.isUndefined(selectTutors) || !angular.isArray(selectTutors)) {
        return false;
      }

      refetchResources();
    });

    /**
     * On Drop
     */
    function eventDrop(event, delta, revert) {

      /**
       * Schedule updated
       */
      if ($window.confirm('Are you sure you want to update this schedule time?')) {

        Schedule.get({
            scheduleId: event.scheduleId
          }).$promise
          .then((schedule) => {
            schedule.tutor = event.resourceId;
            schedule.started = moment(event.start.format());
            schedule.ended = moment(event.end.format());
            schedule.$update()
              .then(() => {
                // $state.reload();
              })
              .catch(onError);
          })
          .catch(onError);


      } else {
        revert();
      }
    }

    /**
     * Resource that calls a function on every view switch
     */
    function resourcesFunction(callback) {

      Tutor.tutorsByList({
          tutorIds: vm.selectTutors
        }).$promise
        .then((tutors) => {

          const resources = tutors.map((tutor) => {
            return {
              id: tutor._id,
              // groupId: tutor.nation.toUpperCase(),
              title: tutor.nickName,
              businessHours: {
                start: '09:00:00',
                end: '24:00:00'
              }
            };
          });
          callback(resources);
        })
        .catch(onError);
    }

    /**
     * Event source that calls a function on every view switch
     */
    function eventsFunction(start, end, timezone, callback) {
      Schedule.query((schedules) => {
        const events = schedules.map((schedule) => {
          if (schedule.scheduleType === 'monthly') {
            return false;
          }

          return {
            resourceId: schedule.tutor._id,
            scheduleId: schedule._id,
            // groupId: schedule.tutor.nation.toUpperCase(),
            title: schedule.user.koreanName,
            state: schedule.state,
            start: moment(schedule.started),
            end: moment(schedule.ended),
            scheduleType: schedule.scheduleType,
            color: schedule.eventColor,
            borderColor: schedule.eventBorderColor
          };
        });
        callback(events);
      });
    }


    function refetchResources() {
      if (uiCalendarConfig.calendars.calendar) {
        uiCalendarConfig.calendars.calendar.fullCalendar('refetchResources');
      }
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

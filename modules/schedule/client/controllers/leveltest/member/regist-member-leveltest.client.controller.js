(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('RegistMemberLeveltestController', RegistMemberLeveltestController);

  /** Dependency Injection */
  RegistMemberLeveltestController.$inject = [
    '$scope',
    '$window',
    '$state',
    'leveltestResolve',
    'Member',
    'Tutor',
    'Schedule',
    'Authentication',
    'TalkDream',
    'dayPickerConfig',
    'uiCalendarConfig',
    'toastr'
  ];

  /**
   * Configuring the regist leveltest controller
   */
  function RegistMemberLeveltestController(
    $scope,
    $window,
    $state,
    leveltest,
    Member,
    Tutor,
    Schedule,
    Authentication,
    TalkDream,
    dayPickerConfig,
    uiCalendarConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;

    vm.leveltest = leveltest;
    vm.tutors = Tutor.query();

    vm.application = {
      minutes: 10,
      productType: 'telephone',
      skill: 'novice'
    };

    vm.regist = regist;
    vm.changeProviders = changeProviders;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    vm.uiConfig = {
      calendar: {
        // height: 800,
        editable: true,
        eventDurationEditable: false,
        schedulerLicenseKey: '0730394876-fcs-1531921860',
        header: {
          left: 'timelineDay',
          center: 'title',
          right: 'prev,today,next '
          // right: 'agendaWeek, agendaDay, timelineDay'
        },
        droppable: true,
        drop: function(date, allDay, jsEvent, ui) {
          console.log(date);
        },
        selectable: true,
        selectHelper: true,
        select: function(start, end) {
          const title = $window.prompt('Event Title:');
          let eventData;
          if (title) {
            eventData = {
              title: title,
              start: start,
              end: end
            };
            $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
          }
          $('#calendar').fullCalendar('unselect');
        },
        // allDayDefault: true,
        // eventClick,
        // eventDrop,
        // googleCalendarApiKey: '35289373171-fojkf1dllu98ooelnnrtd5qdskbe2h4a.apps.googleusercontent.com',
        // maxTime: vm.maxTime,
        defaultView: 'timelineDay',
        displayEventTime: true,
        eventLimit: true,
        groupByResource: true,
        minTime: '09:00:00',
        navLinks: true,
        nowIndicator: true,
        resourceAreaWidth: '10%',
        resourceGroupField: 'groupId',
        resources: resourcesFunction,
        slotDuration: '00:10:00',
        slotEventOverlap: true,
        slotLabelFormat: 'H:mm',
        slotLabelInterval: '00:05:00',
        slotWidth: 100,
        weekends: false
      }
    };

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initApplication();
    }

    /**
     * Initialize leveltest application
     */
    function initApplication() {
      vm.application.minutes = 10;
      vm.application.productType = 'telephone';
      vm.application.skill = 'novice';
    }

    /**
     * Figure out Member to display
     */
    function changeProviders(leveltest) {
      Member.findByProviders(leveltest.providers)
        .then(onFindMemberSuccess)
        .catch(onFindMemberError);

      /** Find member success callback */
      function onFindMemberSuccess(members) {
        vm.members = members;
      }

      /** Find member error callback */
      function onFindMemberError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Manual leveltests
     */
    function regist(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.leveltestForm');
        return false;
      }

      /**
       * Manual leveltests
       */
      if ($window.confirm('Are you sure you want to regist new leveltest?')) {

        vm.application.desired = vm.leveltest.started.clone();
        vm.leveltest.user = vm.member._id;
        vm.leveltest.tutor = vm.tutor._id;
        vm.leveltest.providers = vm.member.providers;
        // vm.leveltest.started = vm.leveltest.started.clone();
        vm.leveltest.ended = vm.leveltest.started.clone()
          .add(vm.application.minutes, 'minutes');
        vm.leveltest.productType = vm.application.productType;
        vm.leveltest.application = vm.application;
        vm.leveltest.state = 'onStandby';
        vm.leveltest.$save()
          .then(onSaveLeveltestSuccess)
          .catch(onSaveLeveltestError);
      }

      /** Save Leveltest success callback */
      function onSaveLeveltestSuccess(leveltest) {
        TalkDream.sendMessageToApplyLeveltest(leveltest.productType, leveltest.user, leveltest._id)
          .then(onSendMessageSuccess)
          .catch(onSendMessageError);
      }

      /** Save Leveltest error callback */
      function onSaveLeveltestError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /** Send to apply to leveltest success callback */
      function onSendMessageSuccess() {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('member.view.leveltest.list.detail', {
          memberId: vm.leveltest.user,
          leveltestId: vm.leveltest._id
        });
      }

      /** Send to apply to leveltest error callback */
      function onSendMessageError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }


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
     * Resource that calls a function on every view switch
     */
    function resourcesFunction(callback) {

      Tutor.find()
        .then(onFindTutorSuccess)
        .catch(onFindTutorError);

      function onFindTutorSuccess(tutors) {
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
      }

      function onFindTutorError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }


    /**
     * Event source that calls a function on every view switch
     */
    function eventsFunction(start, end, timezone, callback) {

      Schedule.find()
        .then(onFindScheduleSuccess)
        .catch(onFindScheduleError);

      function onFindScheduleSuccess(schedules) {
        const events = schedules.map((schedule) => {
          return {
            resourceId: schedule.tutor._id,
            scheduleId: schedule._id,
            // groupId: schedule.tutor.nation.toUpperCase(),
            title: schedule.title,
            state: schedule.state,
            scheduleType: schedule.scheduleType,
            start: moment(schedule.started).clone().tz(vm.auth.user.timezone),
            end: moment(schedule.ended).clone().tz(vm.auth.user.timezone),
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

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('PostponeLessonController', PostponeLessonController);

  /**
   * Dependency Injection
   */
  PostponeLessonController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    'postponeResolve',
    'Lesson',
    'Course',
    'Tutor',
    'Schedule',
    'Authentication',
    'dayPickerConfig',
    'verticalResourceCalendarConfig',
    'googleEventSource',
    'uiCalendarConfig',
    'toastr'
  ];

  /**
   * Configuring the lesson add course controller
   */
  function PostponeLessonController(
    $scope,
    $window,
    $state,
    $q,
    postpone,
    Lesson,
    Course,
    Tutor,
    Schedule,
    Authentication,
    dayPickerConfig,
    verticalResourceCalendarConfig,
    googleEventSource,
    uiCalendarConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.tutors = Tutor.query();

    vm.postpone = postpone;
    vm.postponeLesson = postponeLesson;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);
    // vm.calendarOptions = angular.copy(verticalResourceCalendarConfig);
    // vm.eventSources = [googleEventSource, eventsFunction];

    vm.changeStarted = changeStarted;

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      // initTutor();
      // initCalendar();
      initCheckings();
      initDatePickerOptions();
    }

    /**
     * Initialize current checking days of week checkboxes
     */
    function initCheckings() {
      vm.checkings = vm.postpone.course.daysOfWeek
        .filter((days) => {
          return days.selected;
        })
        .map((days) => {
          return days.index;
        });
    }

    function initTutor() {
      if (vm.postpone.tutor) {
        vm.tutor = vm.postpone.tutor._id || vm.postpone.tutor;
      }
    }

    /** Format monthly picker */
    function initDatePickerOptions() {

      const endLessonStarted = moment(vm.postpone.course.endLesson.started).clone();
      const endLessonStartedDayIndex = endLessonStarted.days();

      let addDayIndex;

      for (let i = 0; i < 7; i += 1) {

        if (vm.checkings.length > 1) {

          /** If the day of the lesson to be postponed falls on the last day of the week */
          if (vm.checkings[vm.checkings.length - 1] === endLessonStartedDayIndex) {

            /**
             * Deferred to the first day of the week.
             * (6 - endLessonStartedDayIndex) + (1 + vm.checkings[0])
             * "6" is the index of Saturday. subtract the index of a date from Saturday(6)
             * Add the first day index and the Sunday index is "0", so add "1"
             */
            addDayIndex = (7 - endLessonStartedDayIndex) + vm.checkings[0];
          } else if (vm.checkings.indexOf(endLessonStartedDayIndex) !== -1) {

            /** If the day to postpone is included on the regular course day */
            const findIndex = vm.checkings.findIndex((dayIndex) => {
              return dayIndex === endLessonStartedDayIndex;
            });

            /**
             * Decide the date of the postponement by subtracting the day immediately preceding it.
             * ex) [1, 3, 4] => vm.checkings[2] - vm.checkings[1] = 3 - 1 = 2; add two days
             */
            addDayIndex = vm.checkings[findIndex + 1] - vm.checkings[findIndex];
          } else {

            /** If the last day of the course is not included on the day of the week set */
            const findIndex = vm.checkings.findIndex((dayIndex) => {
              return dayIndex > endLessonStartedDayIndex;
            });

            if (findIndex !== -1) {

              /** In case the last day of the course falls between the days of the week. */
              addDayIndex = vm.checkings[findIndex] - endLessonStartedDayIndex;
            } else {

              /** If the last day of the course is later than the designated day of the week. */
              addDayIndex = (7 - endLessonStartedDayIndex) + vm.checkings[0];
            }

          }
        } else if (vm.checkings.length === 1) {

          /** In case of 1 times, postpone lesson next week. */
          addDayIndex = 7;
          break;
        } else {

          /** the other cases, postpon lesson next one day */
          addDayIndex = 1;
          break;
        }
      }

      vm.datetimePickerOptions.defaultDate = endLessonStarted
        .add(addDayIndex, 'days');
    }

    /**
     * Initialize lesson resolve
     */
    function initCalendar() {
      vm.calendarOptions.calendar.resources = resourcesFunction;

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
              groupId: tutor.nation.toUpperCase(),
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
    }

    function changeStarted(started) {
      // console.log(moment(started).clone().format('HH:mm:ss'));
      // vm.calendarOptions.calendar.scrollTime = moment(started).clone().format('HH:mm:ss');
      // uiCalendarConfig.calendars.calendar.fullCalendar('gotoDate', moment(started));
      // vm.calendarOptions.calendar.scrollTime = moment(started).format('HH:mm:ss');
      // uiCalendarConfig.calendars.calendar.fullCalendar('reRender');
    }

    function refetchResources() {
      if (uiCalendarConfig.calendars.calendar) {
        uiCalendarConfig.calendars.calendar.fullCalendar('refetchResources');
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
            groupId: schedule.tutor.nation.toUpperCase(),
            title: schedule.title,
            state: schedule.state,
            scheduleType: schedule.scheduleType,
            start: moment(schedule.started).clone().tz(vm.auth.user.timezone),
            end: moment(schedule.ended).clone().tz(vm.auth.user.timezone),
            color: schedule.eventColor,
            borderColor: schedule.eventColor
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

    /**
     * Add lesson to Course
     */
    function postponeLesson(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.postponeForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to postpone this lesson?')) {

        const doc = angular.copy(vm.postpone);

        if (doc._id) {
          delete doc._id;
        }

        const newLesson = new Lesson(doc);
        newLesson.started = moment(vm.started).clone();
        newLesson.ended = moment(vm.started).clone()
          .add(doc.minutes, 'minutes');

        Lesson.postponeLesson(vm.postpone._id, newLesson)
          .then(onPostponeLessonSuccess)
          .catch(onPostponeLessonError);
      }

      /** Postpone lesson success callback */
      function onPostponeLessonSuccess(postpone) {
        Course.findOne(postpone.course._id || postpone.course)
          .then(onFindCourseSuccess)
          .catch(onFindCourseError);
      }

      /** Postpone lesson error callback */
      function onPostponeLessonError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }


      /** Find course success callback */
      function onFindCourseSuccess(course) {
        course.useCounting.postpone += 1;
        course.$update()
          .then(onUpdateCourseSuccess)
          .catch(onUpdateCourseError);
      }

      /** Find course error callback */
      function onFindCourseError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /** Update course success callback */
      function onUpdateCourseSuccess(course) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('member.view.lesson.detail', {
          lessonId: vm.postpone._id
        });
      }

      /** Update course error callback */
      function onUpdateCourseError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }
}());

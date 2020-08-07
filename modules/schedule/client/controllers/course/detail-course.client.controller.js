(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('DetailCourseController', DetailCourseController);

  /**
   * Dependency Injection
   */
  DetailCourseController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    '$filter',
    'courseResolve',
    'lessonsResolve',
    'monthliesResolve',
    'Tutor',
    'Lesson',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the Course detail controller
   */
  function DetailCourseController(
    $scope,
    $window,
    $state,
    $q,
    $filter,
    course,
    lessons,
    monthlies,
    Tutor,
    Lesson,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.course = course;
    vm.lessons = lessons;
    vm.monthlies = monthlies;
    vm.tutors = Tutor.query();

    vm.checkings = [];

    vm.modify = modify;

    vm.autoCheckings = autoCheckings;
    vm.validateForm = validateForm;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);
    // vm.daysOfWeek = daysOfWeekConfig;

    initialize();

    /** On change to days of week checkbox list callback */
    $scope.$watch('vm.checkings', changeCheckings, true);
    /** On change to start date datetimepicker callback */
    $scope.$watch('vm.started', changeStarted);

    /**
     * Initialize
     */
    function initialize() {
      autoCheckings();
      initStartedDatePickerOptions();
      initMainTutor();
    }

    /**
     * On change to days of week checkbox list callback
     */
    function changeCheckings(checkings) {
      if (checkings && checkings.length > 0) {
        /** Validate to days of week checklist for "equal", "required" */
        validateForm();
        /** Generate seed lesson schedule days */
        seedDays();
      }
    }

    /**
     * On change to start date datetimepicker callback
     */
    function changeStarted() {
      seedDays();
    }

    /**
     * Auto select day of weeks
     */
    function autoCheckings() {
      resetCheckings();
      initCheckings();
    }

    /**
     * Initialize current checking days of week checkboxes
     */
    function initCheckings() {
      vm.checkings = vm.course.daysOfWeek
        .filter((days) => {
          return days.selected;
        })
        .map((days) => {
          return days.index;
        });
    }

    /**
     * Reset checkings array
     */
    function resetCheckings() {
      vm.checkings = [];
    }

    /**
     * Init main tutor
     */
    function initMainTutor() {
      if (vm.course.mainTutor) {
        vm.mainTutor = vm.course.mainTutor._id || vm.course.mainTutor;
      }
    }

    /**
     * Init first lesson for state "onStandby"
     */
    function initStartedDatePickerOptions() {
      vm.datetimePickerOptions.defaultDate = moment(vm.course.startLesson.started).clone();
    }

    /**
     * Validate to days fo week and start datetime picker
     */
    function validateForm() {
      if (vm.form.courseForm.daysOfWeek) {
        /** Validate that at least one checkbox of the week is selected */
        vm.form.courseForm.daysOfWeek
          .$setValidity('required', vm.checkings.length > 0);
        /** Validate that the day of the week checkbox is selected by the number of products*/
        // vm.form.courseForm.daysOfWeek
        //   .$setValidity('equal', vm.checkings.length === vm.course.virtualProduct.times);
      }
    }

    /**
     * Generate seed lesson schedule days
     */
    function seedDays() {

      if (vm.course.currentCounting.lesson.onStandby < 1) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.courseForm');
        return false;
      }

      let i = 0;
      const days = [];

      while (days.length < vm.course.currentCounting.lesson.onStandby) {

        /** Next day */
        const increased = moment(vm.started).clone()
          .add(i, 'days');

        /** Check to include "checkings" days of week */
        if (vm.checkings.includes(increased.day())) {
          const day = {
            started: increased.clone(),
            ended: increased.clone()
              .add(vm.course.virtualProduct.minutes, 'minutes')
          };

          days.push(day);
        }
        i += 1;
      }

      /**
       * Promise
       */
      return handleDisabledDaysOfWeek(days)
        .then(handleEndedDateTimePicker)
        .then((days) => {
          return $q((resolve, reject) => {
            if (days && days.length > 0) {
              return resolve(days);
            }
          });
        })
        .catch((err) => {
          toastr.error(err || err.data.message, 'Error', {
            timeOut: 0
          });
        });

      /**
       * Set disabled to Days of week checkboxes
       */
      function handleDisabledDaysOfWeek(days) {
        return $q((resolve, reject) => {
          const daysOfWeekIndexes = [0, 1, 2, 3, 4, 5, 6];
          vm.datetimePickerOptions.daysOfWeekDisabled = daysOfWeekIndexes
            .filter((day) => {
              return !vm.checkings.includes(day);
            });

          return resolve(days);
        });
      }

      /**
       * Set the end of lesson date datetime picker
       */
      function handleEndedDateTimePicker(days) {
        return $q((resolve, reject) => {
          vm.ended = days[days.length - 1].started;
          return resolve(days);
        });
      }
    }

    /**
     * Regist lessons
     */
    function modify(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.courseForm');
        return false;
      }

      /**
       * Regist leveltests
       */
      if ($window.confirm('Are you sure you want to modify course?')) {

        seedDays()
          .then(changeLessons)
          .then(updateCourse)
          .then(() => {
            toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
            $state.reload();
          })
          .catch((err) => {
            toastr.error(err.data.message, 'Error', {
              timeOut: 0
            });
          });
      }


      function changeLessons(days) {
        const deferred = $q.defer();

        const docs = days.map((day, index) => {
          return new Lesson({
            user: vm.course.user,
            tutor: vm.mainTutor,
            course: vm.course._id,
            providers: vm.course.providers,
            productType: vm.course.virtualProduct.productType,
            minutes: vm.course.payment.paymentedProduct.minutes,
            started: moment(day.started).clone(),
            ended: moment(day.ended).clone()
          });
        });

        Lesson.changeLessons('onStandby', vm.course._id, docs)
          .then(onChangeLessonsSuccess)
          .catch(onChangeLessonsError);

        return deferred.promise;

        /** Change lessons success callback */
        function onChangeLessonsSuccess(lessons) {
          deferred.resolve(lessons);
        }

        /** Change lessons error callback */
        function onChangeLessonsError(err) {
          deferred.reject(err);
        }
      }

      /**
       * Start to regist course process
       */
      function updateCourse(lessons) {

        const deferred = $q.defer();

        vm.course.mainTutor = vm.mainTutor;
        vm.course.startLesson = lessons[0]._id;
        vm.course.endLesson = lessons[lessons.length - 1]._id;
        vm.course.virtualProduct.times = vm.checkings.length;
        vm.course.daysOfWeek = vm.course.daysOfWeek.map((day) => {
          return {
            index: day.index,
            name: day.name,
            selected: vm.checkings.includes(day.index)
          };
        });


        vm.course.$update()
          .then(onUpdateCourseSuccess)
          .catch(onUpdateCourseError);

        return deferred.promise;

        function onUpdateCourseSuccess(course) {
          vm.course = course;
          deferred.resolve(true);
        }

        function onUpdateCourseError(err) {
          deferred.reject(err);
        }
      }
    }
  }
}());

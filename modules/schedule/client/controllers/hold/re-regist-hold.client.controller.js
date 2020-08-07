(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('ReRegistHoldController', ReRegistHoldController);

  /**
   * Dependency Injection
   */
  ReRegistHoldController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    '$filter',
    'courseResolve',
    'lessonsResolve',
    'holdResolve',
    'Course',
    'Lesson',
    'Tutor',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the hold detail controller
   */
  function ReRegistHoldController(
    $scope,
    $window,
    $state,
    $q,
    $filter,
    course,
    lessons,
    hold,
    Course,
    Lesson,
    Tutor,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.course = course;
    vm.hold = hold;
    vm.lessons = lessons;
    console.log(vm.course);
    vm.tutors = Tutor.query();
    vm.checkings = [];

    vm.reRegist = reRegist;

    vm.figureOut = figureOut;
    vm.pageChanged = pageChanged;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

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
      buildPager();
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
     * Init Re Regist hope datetimepicker
     */
    function initStartedDatePickerOptions() {
      vm.datetimePickerOptions.defaultDate = moment(vm.hold.reRegisted).clone();
    }

    /**
     * Build page
     */
    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOut();
    }

    /**
     * Figure out to display
     */
    function figureOut() {
      vm.filteredItems = $filter('filter')(vm.lessons, vm.search);
      vm.filterLength = vm.filteredItems.length;
      const begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      const end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    /**
     * Change page event
     */
    function pageChanged() {
      vm.figureOut();
    }

    /**
     * Validate to days fo week and start datetime picker
     */
    function validateForm() {
      if (vm.form.holdForm.daysOfWeek) {
        /** Validate that at least one checkbox of the week is selected */
        vm.form.holdForm.daysOfWeek
          .$setValidity('required', vm.checkings.length > 0);
        /** Validate that the day of the week checkbox is selected by the number of products*/
        // vm.form.holdForm.daysOfWeek
        //   .$setValidity('equal', vm.checkings.length === vm.course.virtualProduct.times);
      }
    }

    /**
     * Generate seed lesson schedule days
     */
    function seedDays() {

      if (vm.course.currentCounting.lesson.hold < 1) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.holdForm');
        return false;
      }

      let i = 0;
      const days = [];

      while (days.length < vm.course.currentCounting.lesson.hold) {

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
     * Hold
     */
    function reRegist(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.holdForm');
        return false;
      }

      /**
       * Hold course
       */
      if ($window.confirm('Are you sure you want to hold this course and lessons?')) {

        seedDays()
          .then(changeLessons)
          .then(findCourse)
          .then(updateCourse)
          .then(updateHold)
          .then(() => {
            toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
            $state.go('member.view.course.list.detail', {
              courseId: vm.course._id
            });
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

        Lesson.changeLessons('hold', vm.course._id, docs)
          .then(onChangeLessonsSuccess)
          .catch(onChangeLessonsError);

        return deferred.promise;

        /** Change lessons success callback */
        function onChangeLessonsSuccess() {
          deferred.resolve(true);
        }

        /** Change lessons error callback */
        function onChangeLessonsError(err) {
          deferred.reject(err);
        }
      }

      /**
       * Find current course
       */
      function findCourse() {

        const deferred = $q.defer();

        Course.findOne(vm.course._id)
          .then(onFindCourseSuccess)
          .catch(onFindCourseError);

        return deferred.promise;

        function onFindCourseSuccess(course) {
          deferred.resolve(course);
        }

        function onFindCourseError(err) {
          deferred.reject(err);
        }
      }

      /**
       * Start to regist course process
       */
      function updateCourse(course) {

        const deferred = $q.defer();


        course.hold = null;
        course.mainTutor = vm.mainTutor;
        course.state = 'inProgress';
        course.virtualProduct.times = vm.checkings.length;
        course.daysOfWeek = vm.course.daysOfWeek.map((day) => {
          return {
            index: day.index,
            name: day.name,
            selected: vm.checkings.includes(day.index)
          };
        });


        course.$update()
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

      function updateHold() {
        const deferred = $q.defer();

        vm.hold.state = 'reRegisted';
        vm.hold.$update()
          .then(onUpdateHoldSuccess)
          .catch(onUpdateHoldError);

        return deferred.promise;

        /** Save hold success callback */
        function onUpdateHoldSuccess() {
          deferred.resolve();
        }

        /** Save hold error callback */
        function onUpdateHoldError(err) {
          deferred.reject(err);
        }
      }
    }
  }
}());

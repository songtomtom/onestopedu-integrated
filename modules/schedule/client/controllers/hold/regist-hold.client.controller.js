(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('RegistHoldController', RegistHoldController);

  /**
   * Dependency Injection
   */
  RegistHoldController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    '$filter',
    'courseResolve',
    'lessonsResolve',
    'holdResolve',
    'Lesson',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the hold detail controller
   */
  function RegistHoldController(
    $scope,
    $window,
    $state,
    $q,
    $filter,
    course,
    lessons,
    hold,
    Lesson,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.course = course;
    vm.lessons = lessons;
    vm.hold = hold;
    console.log(vm.course);

    vm.temporaried = [];

    vm.changeSelected = changeSelected;
    vm.getHoldRate = getHoldRate;

    vm.regist = regist;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initStartedDatePickerOptions();
    }

    /**
     * On change event hold start lesson
     */
    function changeSelected(index) {
      initSelectedIndex(index);
      initTemporaried(index);

    }

    /**
     * Init selected index
     */
    function initSelectedIndex(index) {
      vm.selectedIndex = index;
    }

    /**
     * Init selected lessons to hold
     */
    function initTemporaried(index) {
      if (vm.lessons && vm.lessons.length > 0) {
        vm.temporaried = vm.lessons
          .filter((item, i) => {
            return index <= i && item.state === 'onStandby';
          });
      }
    }

    /**
     * Get selected lessons rate
     */
    function getHoldRate() {
      return Math.ceil((((vm.course.currentCounting.lesson.hold + vm.temporaried.length) || 0) / vm.course.maxCounting.lesson) * 100);
    }

    /**
     * Init regist hope datetimepicker
     */
    function initStartedDatePickerOptions() {
      vm.datetimePickerOptions.defaultDate = moment(vm.course.startLesson.started).clone();
    }

    /**
     * Hold
     */
    function regist(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.holdForm');
        return false;
      }

      /**
       * Hold course
       */
      if ($window.confirm('Are you sure you want to hold this course and lessons?')) {

        saveHold()
          .then(updateCourse)
          .then(holdLessons)
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

      function saveHold() {
        const deferred = $q.defer();

        vm.hold.user = vm.course.user;
        vm.hold.course = vm.course._id;
        vm.hold.providers = vm.course.providers;
        vm.hold.title = vm.course.virtualProduct.title;
        vm.hold.started = moment(vm.temporaried[0].started);
        vm.hold.ended = moment(vm.temporaried[vm.temporaried.length - 1].started);

        vm.hold.$save()
          .then(onSaveHoldSuccess)
          .catch(onSaveHoldError);

        return deferred.promise;

        /** Save hold success callback */
        function onSaveHoldSuccess(hold) {
          deferred.resolve(hold);
        }

        /** Save hold error callback */
        function onSaveHoldError(err) {
          deferred.reject(err);
        }
      }

      /**
       * Update course
       */
      function updateCourse(hold) {
        const deferred = $q.defer();

        vm.course.hold = hold._id;
        vm.course.state = 'hold';
        vm.course.useCounting.hold += 1;
        vm.course.$update()
          .then(onUpdateCourseSuccess)
          .catch(onUpdateCourseError);

        return deferred.promise;

        function onUpdateCourseSuccess(course) {
          deferred.resolve(true);
        }

        function onUpdateCourseError(err) {
          deferred.reject(err);
        }
      }


      function holdLessons() {
        const deferred = $q.defer();

        Lesson.holdLessons(vm.startHoldLessonId)
          .then(onHoldLessonsSuccess)
          .catch(onHoldLessonsError);

        return deferred.promise;

        /** Hold lessons success callback */
        function onHoldLessonsSuccess(lessons) {
          deferred.resolve(lessons);
        }

        /** Hold lessons error callback */
        function onHoldLessonsError(err) {
          deferred.reject(err);
        }
      }
    }
  }
}());

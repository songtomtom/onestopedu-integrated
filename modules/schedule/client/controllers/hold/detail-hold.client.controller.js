(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('DetailHoldController', DetailHoldController);

  /**
   * Dependency Injection
   */
  DetailHoldController.$inject = [
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
  function DetailHoldController(
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

    vm.unHold = unHold;
    vm.modify = modify;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initReRegistedDatePickerOptions();
    }

    /**
     * Init regist hope datetimepicker
     */
    function initReRegistedDatePickerOptions() {
      vm.datetimePickerOptions.defaultDate = moment(vm.hold.reRegisted).clone();
    }

    /**
     * Regist lessons
     */
    function modify(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.holdForm');
        return false;
      }

      /**
       * Modify hold information
       */
      if ($window.confirm('Are you sure you want to modify hold?')) {
        vm.hold.$update()
          .then(onUpdateHoldSuccess)
          .catch(onUpdateHoldError);
      }


      /** Update hold success callback */
      function onUpdateHoldSuccess(hold) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.reload();
      }

      /** Update hold error callback */
      function onUpdateHoldError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Un Hold
     */
    function unHold() {

      /**
       * Hold hold
       */
      if ($window.confirm('Are you sure you want to un hold this course and lessons?')) {

        updateCourse(vm.course)
          .then(updateHold)
          .then(unHoldLessons)
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

      /**
       * Update course
       */
      function updateCourse(course) {
        const deferred = $q.defer();

        course.hold = null;
        course.state = 'inProgress';
        course.useCounting.hold -= 1;
        course.$update()
          .then(onUpdateCourseSuccess)
          .catch(onUpdateCourseError);

        return deferred.promise;

        function onUpdateCourseSuccess(course) {
          deferred.resolve(course);
        }

        function onUpdateCourseError(err) {
          deferred.reject(err);
        }
      }

      function updateHold(course) {
        const deferred = $q.defer();

        vm.hold.state = 'unHold';
        vm.hold.$update()
          .then(onUpdateHoldSuccess)
          .catch(onUpdateHoldError);

        return deferred.promise;

        /** Save hold success callback */
        function onUpdateHoldSuccess() {
          deferred.resolve(course);
        }

        /** Save hold error callback */
        function onUpdateHoldError(err) {
          deferred.reject(err);
        }
      }

      function unHoldLessons(course) {
        const deferred = $q.defer();

        Lesson.unHoldLessons(course._id)
          .then(onUnHoldLessonsSuccess)
          .catch(onUnHoldLessonsError);

        return deferred.promise;

        /** Un hold lessons success callback */
        function onUnHoldLessonsSuccess(lessons) {
          deferred.resolve(lessons);
        }

        /** Un hold lessons error callback */
        function onUnHoldLessonsError(err) {
          deferred.reject(err);
        }
      }
    }
  }
}());

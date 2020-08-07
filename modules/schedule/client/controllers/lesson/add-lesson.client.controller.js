(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('AddLessonController', AddLessonController);

  /**
   * Dependency Injection
   */
  AddLessonController.$inject = [
    '$scope',
    '$window',
    '$state',
    'courseResolve',
    'lessonResolve',
    'Tutor',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the lesson add course controller
   */
  function AddLessonController(
    $scope,
    $window,
    $state,
    course,
    lesson,
    Tutor,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.course = course;
    vm.lesson = lesson;
    vm.tutors = Tutor.query();

    vm.add = add;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initSeedLesson();
    }

    /**
     * Initialize lesson resolve
     */
    function initSeedLesson() {
      vm.lesson.productType = vm.course.virtualProduct.productType;
      vm.lesson.minutes = vm.course.payment.paymentedProduct.minutes;
      vm.lesson.tutor = vm.course.mainTutor._id || vm.course.mainTutor;
    }

    /**
     * Add lesson to Course
     */
    function add(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to add new lessons?')) {

        lesson.course = vm.course._id;
        lesson.user = vm.course.user._id;
        lesson.providers = course.providers;
        lesson.started = moment(vm.started).clone();
        lesson.ended = moment(vm.started).clone()
          .add(vm.lesson.minutes, 'minutes');

        lesson.$save()
          .then(onSaveLessonSuccess)
          .catch(onSaveLessonError);
      }

      /** save lesson success callback */
      function onSaveLessonSuccess(lesson) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('member.view.course.list.detail', {
          courseId: lesson.course._id || lesson.course
        });
      }

      /** Save lesson error callback */
      function onSaveLessonError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

    }
  }

}());

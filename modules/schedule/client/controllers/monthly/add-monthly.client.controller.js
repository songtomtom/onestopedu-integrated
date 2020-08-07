(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('AddMonthlyController', AddMonthlyController);

  /**
   * Dependency Injection
   */
  AddMonthlyController.$inject = [
    '$scope',
    '$window',
    '$state',
    'monthlyResolve',
    'Member',
    'Tutor',
    'Course',
    'Monthly',
    'Authentication',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the add monthly controller
   */
  function AddMonthlyController(
    $scope,
    $window,
    $state,
    monthly,
    Member,
    Tutor,
    Course,
    Monthly,
    Authentication,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.monthly = monthly;

    vm.add = add;
    vm.auth = Authentication;
    vm.tutors = Tutor.query();

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    vm.changeProviders = changeProviders;
    vm.changeMembers = changeMembers;
    vm.changeCourses = changeCourses;
    vm.changeStarted = changeStarted;
    vm.changeEnded = changeEnded;

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initDatePickerOptions();
      initStartedDatePickerOptions();
      initEndedDatePickerOptions();
    }

    /** Format monthly picker */
    function initDatePickerOptions() {
      vm.datetimePickerOptions.format = 'YYYY/MM/DD';
    }
    /** Initialize start datetimepicker */
    function initStartedDatePickerOptions() {
      vm.startedDatetimePickerOptions = angular.copy(vm.datetimePickerOptions);
    }

    /** Initialize end datetimepicker */
    function initEndedDatePickerOptions() {
      vm.endedDatetimePickerOptions = angular.copy(vm.datetimePickerOptions);
      vm.endedDatetimePickerOptions.defaultDate = moment().add(14, 'days');
    }

    /** On change start datetime picker */
    function changeStarted(started) {
      vm.endedDatetimePickerOptions.minDate = moment(started).clone();
    }

    /** On change end datetime picker */
    function changeEnded(ended) {
      vm.startedDatetimePickerOptions.maxDate = moment(ended).clone();
    }

    /** Find Member to display */
    function changeProviders(providers) {

      if (!providers) {
        return false;
      }

      Member.findByProviders(providers)
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

    /** Find course to display */
    function changeMembers(memberId) {

      if (!memberId) {
        return false;
      }

      Course.findByMemberId(memberId)
        .then(onFindCourseSuccess)
        .catch(onFindCourseError);

      /** Find course success callback */
      function onFindCourseSuccess(courses) {
        console.log(courses);
        vm.courses = courses;
      }

      /** Find course error callback */
      function onFindCourseError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }


    /** Find monthly evaluation */
    function changeCourses(courseId) {
      vm.monthlies = undefined;
      if (!courseId) {
        return false;
      }

      Monthly.findByCourseId(courseId)
        .then(onFindMonthlySuccess)
        .catch(onFindMonthlyError);

      /** Find monthly evaluation success callback */
      function onFindMonthlySuccess(monthlies) {
        vm.monthlies = monthlies;
      }

      /** Find monthly evaluation error callback */
      function onFindMonthlyError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Manual monthlys
     */
    function add(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.monthlyForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to add new monthly?')) {

        vm.monthly.user = vm.member._id;
        vm.monthly.course = vm.course._id;
        vm.monthly.started = moment(vm.started).clone()
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0);
        vm.monthly.ended = moment(vm.ended).clone()
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0);

        vm.monthly.$save()
          .then(onSaveMonthlySuccess)
          .catch(onSaveMonthlyError);
      }

      /** Save monthly success callback */
      function onSaveMonthlySuccess(monthly) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('member.view.monthly.list.detail', {
          monthlyId: monthly._id,
          memberId: monthly.user._id || monthly.user
        });
      }

      /** Save monthly success callback */
      function onSaveMonthlyError(err) {
        toastr.error(err.data.message || err, 'Error', {
          timeOut: 0
        });
      }
    }
  }

}());

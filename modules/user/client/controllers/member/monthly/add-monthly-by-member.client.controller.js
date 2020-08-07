(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('AddMonthlyByMemberController', AddMonthlyByMemberController);

  /**
   * Dependency Injection
   */
  AddMonthlyByMemberController.$inject = [
    '$scope',
    '$window',
    '$state',
    'memberResolve',
    'courseResolve',
    'monthlyResolve',
    'Tutor',
    'Monthly',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the add monthly controller
   */
  function AddMonthlyByMemberController(
    $scope,
    $window,
    $state,
    member,
    course,
    monthly,
    Tutor,
    Monthly,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.member = member;
    vm.course = course;
    vm.monthly = monthly;

    vm.add = add;
    vm.tutors = Tutor.query();

    vm.changeStarted = changeStarted;
    vm.changeEnded = changeEnded;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      findMonthly(vm.course._id);
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

    /** Find monthly evaluation */
    function findMonthly(courseId) {

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
        vm.monthly.providers = vm.member.providers;
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
          monthlyId: monthly._id
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

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('DetailMonthlyController', DetailMonthlyController);

  /**
   * Dependency Injection
   */
  DetailMonthlyController.$inject = [
    '$scope',
    '$window',
    '$state',
    'monthlyResolve',
    'evaluationResolve',
    'commentResolve',
    'Tutor',
    'Authentication',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the Monthly detail controller
   */
  function DetailMonthlyController(
    $scope,
    $window,
    $state,
    monthly,
    evaluation,
    comment,
    Tutor,
    Authentication,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.tutors = Tutor.query();

    vm.monthly = monthly;
    vm.evaluation = evaluation;
    vm.comment = comment;

    vm.replyComment = replyComment;
    vm.evaluate = evaluate;
    vm.modify = modify;
    vm.remove = remove;

    vm.changeStarted = changeStarted;
    vm.changeEnded = changeEnded;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initDatePickerOptions();
      initStartedDatePickerOptions();
      initEndedDatePickerOptions();
      initTutors();
    }

    /** Format monthly picker */
    function initDatePickerOptions() {
      vm.datetimePickerOptions.format = 'YYYY/MM/DD';
    }

    /** Initialize start datetimepicker */
    function initStartedDatePickerOptions() {
      const started = angular.copy(vm.monthly.started);

      vm.startedDatetimePickerOptions = angular.copy(vm.datetimePickerOptions);
      vm.startedDatetimePickerOptions.defaultDate = started;
    }

    /** Initialize end datetimepicker */
    function initEndedDatePickerOptions() {
      const ended = angular.copy(vm.monthly.ended);

      vm.endedDatetimePickerOptions = angular.copy(vm.datetimePickerOptions);
      vm.endedDatetimePickerOptions.defaultDate = ended;
    }

    /**
     * On change start datetime picker
     */
    function changeStarted(started) {
      vm.endedDatetimePickerOptions.minDate = moment(started).clone();
    }

    /**
     * On change end datetime picker
     */
    function changeEnded(ended) {
      vm.startedDatetimePickerOptions.maxDate = moment(ended).clone();
    }

    /** Initialize tutors datetimepicker */
    function initTutors() {
      vm.monthly.tutors = vm.monthly.tutors.map((tutor) => {
        return tutor._id;
      });
    }

    /**
     * Reply comment
     */
    function replyComment(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.commentForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to reply comment?')) {

        vm.comment.user = vm.auth.user._id;
        vm.comment.contents = vm.comment.contents.replace(/(?:\r\n|\r|\n)/g, '<br />');
        vm.comment.$save()
          .then(onSaveCommentSuccess)
          .catch(onSaveCommentError);
      }

      /** Save comment success callback */
      function onSaveCommentSuccess(comment) {
        vm.monthly.comments.push(comment._id);
        vm.monthly.$update()
          .then(onUpdateMonthlySuccess)
          .catch(onUpdateMonthlyError);
      }

      /** Save comment error callback */
      function onSaveCommentError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /** Update monthly success callback */
      function onUpdateMonthlySuccess() {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.reload();
      }

      /** Update monthly error callback */
      function onUpdateMonthlyError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Modify monthly
     */
    function modify(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.monthlyForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this monthly?')) {
        vm.monthly.started = moment(vm.started);
        vm.monthly.ended = moment(vm.ended);
        vm.monthly.started = moment(vm.abled);
        vm.monthly.$update()
          .then(onUpdateMonthlySuccess)
          .catch(onUpdateMonthlyError);
      }

      /** Update Monthly success callback */
      function onUpdateMonthlySuccess() {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.reload();
      }

      /** Update Monthly error callback */
      function onUpdateMonthlyError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Remove monthly
     */
    function remove(monthly) {

      if ($window.confirm('Are you sure you want to remove this monthly evaluation?')) {

        monthly.$remove()
          .then(onRemoveMonthlySuccess)
          .catch(onRemoveMonthlyError);
      }

      /** Remove monthly evaluation success callback */
      function onRemoveMonthlySuccess() {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('member.view.monthly.list', {}, {
          reload: true
        });
      }

      /** Remove monthly evaluation error callback */
      function onRemoveMonthlyError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

    }

    /**
     * Evaluate monthly
     */
    function evaluate(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.evaluationForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to evaluate this monthly?')) {
        vm.evaluation.$update()
          .then(onUpdateEvaluationSuccess)
          .catch(onUpdateEvaluationError);
      }

      /** Success evaluation save callback */
      function onUpdateEvaluationSuccess() {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.reload();
      }

      /** Success evaluation update callback */
      function onUpdateEvaluationError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }

}());

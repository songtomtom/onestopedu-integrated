(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('DetailGuestLeveltestController', DetailGuestLeveltestController);

  /**
   * Dependency Injection
   */
  DetailGuestLeveltestController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$timeout',
    'leveltestResolve',
    'assessmentResolve',
    'commentResolve',
    'Tutor',
    'Mail',
    'FileItem',
    'Upload',
    'Authentication',
    'ngAudio',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the leveltest modify controller
   */
  function DetailGuestLeveltestController(
    $scope,
    $window,
    $state,
    $timeout,
    leveltest,
    assessment,
    comment,
    Tutor,
    Mail,
    FileItem,
    Upload,
    Authentication,
    ngAudio,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.tutors = Tutor.query();

    vm.leveltest = leveltest;
    vm.assessment = assessment;
    vm.comment = comment;

    vm.evaluate = evaluate;
    vm.modify = modify;
    vm.replyComment = replyComment;
    vm.sendMail = sendMail;
    vm.uploadFile = uploadFile;
    vm.cancelFile = cancelFile;
    vm.playAudio = playAudio;
    vm.stopAudio = stopAudio;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize lveltest object and DOM
     */
    function initialize() {
      if (angular.isDefined(vm.leveltest)) {
        initProductType();
        initTutor();
        initRecordFile();
        initStarted();
      }
    }

    /**
     * Initialize product type, when does not exists leveltest product type value
     */
    function initProductType() {
      vm.leveltest.productType = vm.leveltest.application.productType;
    }

    /**
     * Initialize leveltest regist tutor
     */
    function initTutor() {
      if (vm.leveltest.tutor) {
        vm.tutor = vm.leveltest.tutor._id;
      }
    }

    /**
     * Initialize record file, audio tag on load
     */
    function initRecordFile() {
      if (vm.assessment.recordFile) {
        vm.audio = ngAudio.load(vm.assessment.recordFile.path);
      }
    }

    /**
     * Initialize datetime picker to start date
     */
    function initStarted() {
      vm.datetimePickerOptions.defaultDate = moment(vm.leveltest.started);
    }

    /**
     * Play Audio
     */
    function playAudio() {
      if (vm.audio.paused) {
        vm.audio.play();
      } else {
        vm.audio.pause();
      }
    }

    /**
     * Stop Audio
     */
    function stopAudio() {
      vm.audio.restart();
    }

    /**
     * Upload File
     */
    function uploadFile() {

      Upload.upload({
        url: '/api/file-item/upload',
        data: {
          newFileItem: vm.recordfile,
          filterName: 'recordFileFilter'
        }
      }).then((response) => {
        $timeout(() => {
          onUploadFileItemsSuccess(response.data);
        }, 1500);
      }, (response) => {
        if (response.status > 0) {
          onUploadFileItemsError(response);
        }
      });

      // Called after the user has successfully uploaded a new picture
      function onUploadFileItemsSuccess(fileItem) {
        fileItem.user = vm.auth.user._id;
        FileItem.saveFileItem(fileItem)
          .then(onSaveFileItemSuccess)
          .catch(onSaveFileItemError);

      }

      // Called after the user has failed to upload a new picture
      function onUploadFileItemsError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      // File items upload log create success callback
      function onSaveFileItemSuccess(fileItem) {
        vm.assessment.recordFile = fileItem._id;
        vm.assessment.$update()
          .then(onUpdateAssessmentSuccess)
          .catch(onUpdateAssessmentError);
      }

      // File items upload log create error callback
      function onSaveFileItemError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      // File items upload log create success callback
      function onUpdateAssessmentSuccess(assessment) {
        vm.assessment = assessment;
        $state.reload();

        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      }

      // File items upload log create error callback
      function onUpdateAssessmentError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    function cancelFile() {
      vm.recordfile = undefined;
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
        vm.comment.$save(onSaveCommentSuccess, onError);
      }
    }

    /**
     * Save Comment success callback
     */
    function onSaveCommentSuccess(comment) {
      vm.leveltest.comments.push(comment._id);
      vm.leveltest.$update(onReload, onError);
    }


    /**
     * Modify leveltest
     */
    function modify(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.leveltestForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this leveltest?')) {

        vm.leveltest.tutor = vm.tutor;
        vm.leveltest.ended = vm.leveltest.started.clone()
          .add(vm.leveltest.application.minutes, 'minutes');

        if (vm.leveltest.state === 'applied' && vm.leveltest.tutor) {
          vm.leveltest.state = 'onStandby';
        }

        vm.leveltest.$update(onReload, onError);
      }
    }

    /**
     * Evaluate leveltest
     */
    function evaluate(isValid) {

      if (!isValid && vm.leveltest.state === 'attendance') {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.assessmentForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to evaluate this leveltest?')) {
        vm.assessment.$update(onUpdateAssessmentSuccess, onError);
      }
    }

    /**
     * Success assessment update callback
     */
    function onUpdateAssessmentSuccess() {
      sendMail(leveltest);
    }


    /**
     * Send E mail
     */
    function sendMail() {
      if ($window.confirm('Would you like to send an email this result to guest?')) {
        Mail.sendToLeveltestAssessment(vm.leveltest.user._id)
          .then(onSendToLeveltestAssessmentSuccess)
          .catch(onError);
      }
    }

    function onSendToLeveltestAssessmentSuccess() {
      vm.assessment.mailed = moment();
      vm.assessment.$update(onReload, onError);
    }

    /**
     * Reload callback
     */
    function onReload() {
      toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      $state.reload();
    }

    /**
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }

  }

}());

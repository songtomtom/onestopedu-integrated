(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('DetailLessonController', DetailLessonController);

  /**
   * Dependency Injection
   */
  DetailLessonController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$filter',
    '$q',
    '$timeout',
    'lessonResolve',
    'feedbackResolve',
    'commentResolve',
    'Tutor',
    'Lesson',
    'Course',
    'FileItem',
    'Upload',
    'Authentication',
    'ngAudio',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the Lesson detail controller
   */
  function DetailLessonController(
    $scope,
    $window,
    $state,
    $filter,
    $q,
    $timeout,
    lesson,
    feedback,
    comment,
    Tutor,
    Lesson,
    Course,
    FileItem,
    Upload,
    Authentication,
    ngAudio,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.$state = $state;

    vm.auth = Authentication;
    vm.tutors = Tutor.query();
    vm.mainTutors = Tutor.query();

    vm.lesson = lesson;
    vm.feedback = feedback;
    vm.comment = comment;

    vm.replyComment = replyComment;

    vm.uploadFile = uploadFile;
    vm.cancelFile = cancelFile;

    vm.playAudio = playAudio;
    vm.stopAudio = stopAudio;

    vm.evaluate = evaluate;

    vm.modifyLesson = modifyLesson;
    vm.removeLesson = removeLesson;
    vm.nextLesson = nextLesson;
    vm.previousLesson = previousLesson;

    vm.revertPostpone = revertPostpone;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      findLessonList();
      initMainTutor();
      initTutor();
      initAudio();
      initStarted();
    }

    /**
     * Get lesson list has to same course id
     */
    function findLessonList() {
      Lesson.findByCourseId(vm.lesson.course._id)
        .then(onFindLessonSuccess)
        .catch(onFindLessonError);

      /** Find lessons error callback */
      function onFindLessonSuccess(lessons) {
        vm.lessons = lessons;
      }
      /** Find lessons error callback */
      function onFindLessonError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /** Get lesson list has to same course id */
    function initMainTutor() {
      if (vm.lesson.course) {
        vm.mainTutor = vm.lesson.course.mainTutor;
      }
    }

    /** Initialize tutor */
    function initTutor() {
      if (vm.lesson.tutor) {
        vm.tutor = vm.lesson.tutor._id;
      }
    }

    /** Initialize record file */
    function initAudio() {
      if (vm.lesson.feddback && vm.feedback.recordFile) {
        vm.audio = ngAudio.load(vm.feedback.recordFile.path);
      }
    }

    /** Initialize datetime picker to start date */
    function initStarted() {
      vm.datetimePickerOptions.defaultDate = moment(vm.lesson.started);
    }

    /**
     * Go next lesson
     */
    function nextLesson() {
      Lesson.findOneByNext(vm.lesson._id)
        .then(onFindLessonSuccess)
        .catch(onFindLessonError);

      /** Find lessons error callback */
      function onFindLessonSuccess(lesson) {
        $state.go('member.view.lesson.detail', {
          lessonId: lesson._id,
          memberId: lesson.user._id || lesson.user
        });
      }
      /** Find lessons error callback */
      function onFindLessonError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Go previous lesson
     */
    function previousLesson() {
      Lesson.findOneByPrevious(vm.lesson._id)
        .then(onFindLessonSuccess)
        .catch(onFindLessonError);

      /** Find lessons error callback */
      function onFindLessonSuccess(lesson) {
        $state.go('member.view.lesson.detail', {
          lessonId: lesson._id,
          memberId: lesson.user._id || lesson.user
        });
      }
      /** Find lessons error callback */
      function onFindLessonError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
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
        vm.feedback.recordFile = fileItem._id;
        vm.feedback.$update()
          .then(onUpdateFeedbackSuccess)
          .catch(onUpdateFeedbackError);
      }

      // File items upload log create error callback
      function onSaveFileItemError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      // File items upload log create success callback
      function onUpdateFeedbackSuccess(feedback) {
        vm.feedback = feedback;
        $state.reload();
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      }

      // File items upload log create error callback
      function onUpdateFeedbackError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Cancel file item
     */
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
        vm.comment.$save()
          .then(onSaveCommentSuccess)
          .catch(onSaveCommentError);
      }

      /** Save comment success callback */
      function onSaveCommentSuccess(comment) {
        vm.lesson.comments.push(comment._id);
        vm.lesson.$update()
          .then(onUpdateLessonSuccess)
          .catch(onUpdateLessonError);
      }

      /** Save comment error callback */
      function onSaveCommentError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /** Update comment success callback */
      function onUpdateLessonSuccess(lesson) {
        $state.reload();
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      }

      /** Update comment error callback */
      function onUpdateLessonError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Modify lesson
     */
    function modifyLesson(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.lessonForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this lesson?')) {

        vm.lesson.tutor = vm.tutor;
        vm.lesson.ended = vm.lesson.started.clone()
          .add(vm.lesson.minutes, 'minutes');

        vm.lesson.$update()
          .then(onUpdateLessonSuccess)
          .catch(onUpdateLessonError);
      }

      /** Update lesson success callback */
      function onUpdateLessonSuccess(lesson) {
        Course.findOne(lesson.course._id || lesson.course)
          .then(onFindCourseSuccess)
          .catch(onFindCourseError);
      }

      /** Update lesson error callback */
      function onUpdateLessonError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /** Find course success callback */
      function onFindCourseSuccess(course) {

        /** Update Course */
        course.$update()
          .then(onUpdateCourseSuccess)
          .catch(onUpdateCourseError);
      }

      /** Find dourse error callback */
      function onFindCourseError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /** Update course success callback */
      function onUpdateCourseSuccess(course) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.reload();
      }

      /** Update course error callback */
      function onUpdateCourseError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Remove lesson
     */
    function removeLesson(lesson) {

      if ($window.confirm('Are you sure you want to remove this lesson?')) {

        lesson.$remove()
          .then(onRemoveLessonSuccess)
          .catch(onRemoveLessonError);
      }

      /** Remove lesson success callback */
      function onRemoveLessonSuccess(lesson) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('member.view.course.list.detail', {
          courseId: lesson.course._id
        });
      }

      /** Remove lesson error callback */
      function onRemoveLessonError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

    }

    /**
     * Evaluate lesson
     */
    function evaluate(isValid) {

      if (!isValid && vm.lesson.state === 'attendance') {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.feedbackForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to evaluate this lesson?')) {
        vm.feedback.$update()
          .then(onUpdateFeedbackSuccess)
          .catch(onUpdateFeedbackError);
      }

      /** Update feedback success callback */
      function onUpdateFeedbackSuccess() {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.reload();
      }

      /** Update feedback error callback */
      function onUpdateFeedbackError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }


    /**
     * Revert postpone
     */
    function revertPostpone() {

      if ($window.confirm('Are you sure you want to revert this postpone lesson?')) {

        Lesson.revertPostpone(vm.lesson._id)
          .then(onRevertPostponeSuccess)
          .catch(onRevertPostponeError);
      }

      /** Postpone lesson success callback */
      function onRevertPostponeSuccess(postpone) {
        Course.findOne(postpone.course._id || postpone.course)
          .then(onFindCourseSuccess)
          .catch(onFindCourseError);
      }

      /** Postpone lesson error callback */
      function onRevertPostponeError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /** Find course success callback */
      function onFindCourseSuccess(course) {
        course.useCounting.postpone -= 1;
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
          lessonId: vm.lesson._id
        }, {
          reload: true
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

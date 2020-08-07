(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ReadTutorBoardController', ReadTutorBoardController);

  /**
   * Dependency Injection
   */
  ReadTutorBoardController.$inject = [
    '$scope',
    '$window',
    '$state',
    'tutorBoardResolve',
    'commentResolve',
    'Comment',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the Course Review read controller
   */
  function ReadTutorBoardController(
    $scope,
    $window,
    $state,
    tutorBoard,
    comment,
    Comment,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.comment = comment;
    vm.editComment = editComment;
    vm.openEditComment = openEditComment;
    vm.removeComment = removeComment;
    vm.removeTutorBoard = removeTutorBoard;
    vm.replyComment = replyComment;
    vm.tutorBoard = tutorBoard;
    vm.isImage = isImage;

    initialize();

    /**
     * Init
     */
    function initialize() {
      if (vm.auth.user.roles[0] === 'tutor') {
        vm.filterTutor = vm.tutorBoard.tutors.filter((tutor) => {
          return tutor._id === vm.auth.user._id;
        });
        vm.targetTutor = vm.filterTutor[0];
      } else {
        vm.targetTutor = vm.tutorBoard.tutors[0];
      }
    }

    /**
     * Iamge Filter
     */
    function isImage(mimetype) {
      return mimetype.indexOf('image') !== -1;
    }

    /**
     * Open Edit Comment
     */
    function openEditComment(comment) {
      vm.currentComment = comment;
      vm.currentComment.contents = vm.currentComment.contents.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n');
    }

    /**
     * Remove Course Review
     */
    function removeTutorBoard() {

      if ($window.confirm('Are you sure you want to remove this tutor board contents and comments?')) {

        /**
         * Remove all comment
         */
        const commentsLength = vm.tutorBoard.comments.length;

        if (commentsLength > 0) {
          vm.tutorBoard.comments.forEach((comment, index) => {
            Comment.get({
                commentId: comment._id
              }).$promise
              .then((comment) => {

                /**
                 * Remove comment
                 */
                comment.$remove()
                  .catch(onError);
              });
          });
        }

        /**
         * Fail to remove comment
         */
        if (vm.tutorBoard.comments.length > 0) {
          return false;
        }

        /**
         * Remove Daily Report
         */
        vm.tutorBoard.$remove()
          .then(() => {

            /**
             * On State
             */
            toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
            $state.go('tutor.tutor-board.list');
          })
          .catch(onError);

      }
    }

    /**
     * Remove comment
     */
    function removeComment(comment) {
      if ($window.confirm('Are you sure you want to remove comment?')) {
        Comment.get({
            commentId: comment._id
          }).$promise
          .then(onFindCommentSuccess)
          .catch(onError);
      }

      /**
       * Find comment success callback
       */
      function onFindCommentSuccess(foundComment) {
        foundComment.$remove()
          .then(onRemoveCommentSuccess)
          .catch(onError);
      }

      /**
       * Remove comment success callback
       */
      function onRemoveCommentSuccess(removedComment) {

        /**
         * Pop removed comment
         */
        vm.tutorBoard.comments.splice(vm.tutorBoard.comments.findIndex((comment) => {
          return comment._id === removedComment._id;
        }), 1);


        /**
         * Tutor Board commets update
         */
        vm.tutorBoard.$update()
          .then(onUpdateTutorBoardSuccess)
          .catch(onError);
      }

      /**
       * Update comment success callback
       */
      function onUpdateTutorBoardSuccess(updatedTutorBoard) {

        /**
         * Reload
         */
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.reload();
      }

    }

    /**
     * Edit Comment
     */
    function editComment(isValid, comment) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.editCommentForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to edit comment?')) {

        Comment.get({
            commentId: comment._id
          }).$promise
          .then((editComment) => {

            /**
             * Update comment
             */
            editComment.contents = comment.contents.replace(/(?:\r\n|\r|\n)/g, '<br />');
            editComment.$update()
              .then(() => {

                /**
                 * Reload
                 */
                toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
                $state.reload();

              })
              .catch(onError);
          })
          .catch(onError);
      }
    }

    /**
     * Reply comment
     */
    function replyComment(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.replyCommentForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to reply comment?')) {

        /**
         * Save Comment
         */
        vm.comment.to = (vm.auth.user.roles[0] === 'tutor') ? vm.tutorBoard.user._id : vm.targetTutor._id;
        vm.comment.user = vm.auth.user._id;
        vm.comment.contents = vm.comment.contents.replace(/(?:\r\n|\r|\n)/g, '<br />');
        vm.comment.$save()
          .then(onSaveCommentSuccess)
          .catch(onError);
      }
    }

    /**
     * Save Comment success callback
     */
    function onSaveCommentSuccess(comment) {
      vm.tutorBoard.comments.push(comment._id);
      vm.tutorBoard.$update()
        .then((updatedTutorBoard) => {

          /**
           * Reload
           */
          toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
          $state.reload();
        })
        .catch(onError);
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

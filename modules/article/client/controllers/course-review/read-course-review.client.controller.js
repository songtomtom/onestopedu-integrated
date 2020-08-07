(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('ReadCourseReviewController', ReadCourseReviewController);

  /**
   * Dependency Injection
   */
  ReadCourseReviewController.$inject = [
    '$scope',
    '$window',
    '$state',
    'courseReviewResolve',
    'commentResolve',
    'Comment',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the Course Review read controller
   */
  function ReadCourseReviewController(
    $scope,
    $window,
    $state,
    courseReview,
    comment,
    Comment,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.courseReview = courseReview;
    vm.comment = comment;

    vm.editComment = editComment;
    vm.openEditComment = openEditComment;
    vm.removeComment = removeComment;
    vm.removeCourseReview = removeCourseReview;
    vm.replyComment = replyComment;
    vm.isImage = isImage;

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
    function removeCourseReview() {

      if ($window.confirm('Are you sure you want to remove this contact us and comments?')) {

        /**
         * Remove all comment
         */
        const commentsLength = vm.courseReview.comments.length;
        vm.courseReview.comments.forEach((comment, index) => {
          Comment.get({
              commentId: comment._id
            }).$promise
            .then((comment) => {

              /**
               * Remove comment
               */
              comment.$remove()
                .then(() => {

                  /**
                   * If euqual article has comments count to index + 1
                   */
                  if (commentsLength === index + 1) {

                    /**
                     * Remove contact us
                     */
                    vm.courseReview.$remove()
                      .then(() => {
                        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
                        $state.go('cs-center.course-review.list');
                      })
                      .catch(onError);
                  }
                })
                .catch(onError);
            });
        });

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
          .then((comment) => {

            /**
             * Remove comment
             */
            comment.$remove()
              .then((comment) => {

                vm.courseReview.comments.pop(comment._id);
                vm.courseReview.$update()
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
          })
          .catch(onError);
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
      vm.courseReview.comments.push(comment._id);
      vm.courseReview.$update()
        .then(() => {

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

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ReadContact1x1ByMemberController', ReadContact1x1ByMemberController);

  /**
   * Dependency Injection
   */
  ReadContact1x1ByMemberController.$inject = [
    '$scope',
    '$window',
    '$state',
    'contact1x1Resolve',
    'commentResolve',
    'Comment',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the Contact Us read controller
   */
  function ReadContact1x1ByMemberController(
    $scope,
    $window,
    $state,
    contact1x1,
    comment,
    Comment,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.contact1x1 = contact1x1;
    vm.comment = comment;

    vm.editComment = editComment;
    vm.openEditComment = openEditComment;
    vm.removeComment = removeComment;
    vm.removeContact1x1 = removeContact1x1;
    vm.replyComment = replyComment;

    /**
     * Open Edit Comment
     */
    function openEditComment(comment) {
      vm.currentComment = comment;
      vm.currentComment.contents = vm.currentComment.contents.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n');
    }

    /**
     * Remove Contact Us
     */
    function removeContact1x1() {

      if ($window.confirm('Are you sure you want to remove this contact us and comments?')) {

        /**
         * Remove all comment
         */
        const commentsLength = vm.contact1x1.comments.length;
        vm.contact1x1.comments.forEach((comment, index) => {
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
                    vm.contact1x1.$remove()
                      .then(() => {
                        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
                        $state.go('cs-center.contact-1x1.list');
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

                vm.contact1x1.comments.pop(comment._id);
                vm.contact1x1.$update()
                  .then(onSuccess)
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
              .then(onSuccess)
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
      vm.contact1x1.comments.push(comment._id);
      vm.contact1x1.$update()
        .then(onSuccess)
        .catch(onError);
    }

    /**
     * Success callback
     */
    function onSuccess() {
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

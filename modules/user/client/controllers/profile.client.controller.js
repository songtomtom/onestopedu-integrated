(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ProfileController', ProfileController);

  /**
   * Dependency Injection
   */
  ProfileController.$inject = [
    '$scope',
    '$http',
    '$timeout',
    '$state',
    '$window',
    'User',
    'FileItem',
    'Upload',
    'Authentication',
    'toastr'
  ];

  /**
   * Configuring the profile picture changed controller
   */
  function ProfileController(
    $scope,
    $http,
    $timeout,
    $state,
    $window,
    User,
    FileItem,
    Upload,
    Authentication,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.profileImage = vm.auth.user.profileImage;
    vm.backgroundImageName = getBackgroundImageName();
    vm.changeUserPassword = changeUserPassword;

    vm.uploadFile = uploadFile;
    vm.cancelFile = cancelFile;


    /**
     * Upload File
     */
    function uploadFile() {

      Upload.upload({
        url: '/api/file-item/upload',
        data: {
          newFileItem: vm.profileFile,
          filterName: 'imageFileFilter'
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
     * Change user password
     */
    function changeUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.passwordForm');
        return false;
      }

      User.changeUserPassword(vm.passwordDetails)
        .then(onChangePasswordSuccess)
        .catch(onChangePasswordError);

      /** Change password success callback */
      function onChangePasswordSuccess(response) {
        vm.passwordDetails = null;
        $http.get('/api/auth/signout')
          .success(onSignoutSuccess)
          .error(onSignoutError);
      }

      /** Change password error callback */
      function onChangePasswordError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /** Sign out success callback */
      function onSignoutSuccess() {
        $window.location.reload();
      }

      /** Sign out error callback */
      function onSignoutError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }



    /**
     * Geneate random(1 ~ 17) number and Sign in background image name
     * @return {[String]} Background image name
     */
    function getBackgroundImageName() {
      return `/modules/user/client/img/profile-bg/profile-bg-${Math.floor(Math.random() * 8) + 1}.jpg`;
    }
  }
}());

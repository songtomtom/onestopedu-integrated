(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('EditNoticeController', EditNoticeController);

  /**
   * Dependency Injection
   */
  EditNoticeController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    '$timeout',
    'noticeResolve',
    'FileItem',
    'Authentication',
    'Upload',
    'summernoteConfig',
    'toastr'
  ];

  /**
   * Configuring the Notice edit controller
   */
  function EditNoticeController(
    $scope,
    $window,
    $state,
    $q,
    $timeout,
    notice,
    FileItem,
    Authentication,
    Upload,
    summernoteConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.edit = edit;
    vm.notice = notice;
    vm.removeFile = removeFile;
    vm.cancelFile = cancelFile;
    vm.summernoteOptions = summernoteConfig;

    /**
     * Cancel File
     */
    function cancelFile(fileItemIndex) {
      if (vm.attachmentFiles && vm.attachmentFiles.length > 0) {
        vm.attachmentFiles.splice(fileItemIndex, 1);
      }
    }

    /**
     * Remove attachment File
     */
    function removeFile(fileItemIndex) {
      vm.notice.attachmentFiles.splice(fileItemIndex, 1);
    }

    /**
     * Notice Edit
     */
    function edit(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.noticeForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to edit this notice?')) {

        fileUploads(vm.notice)
          .then(updateNotice)
          .then((notice) => {
            $state.go('cs-center.notice.read', {
              noticeId: notice._id
            });
          })
          .catch((err) => {
            toastr.error(err.data.message, 'Error', {
              timeOut: 0
            });
          });
      }
    }

    /**
     * Upload file
     */
    function fileUploads(notice) {
      const deferred = $q.defer();

      if (vm.attachmentFiles && vm.attachmentFiles.length > 0) {
        vm.attachmentFiles.forEach((fileItem, index, array) => {
          Upload.upload({
            url: '/api/file-item/upload',
            data: {
              newFileItem: fileItem,
              filterName: 'attachFileFilter'
            }
          }).then((response) => {
            $timeout(() => {
              onUploadFileItemsSuccess(response.data, () => {
                if (index + 1 === array.length) {
                  deferred.resolve(notice);
                }
              });
            }, 1000);
          }, (response) => {
            deferred.reject(response);
            if (response.status > 0) {
              onUploadFileItemsError(response);
            }
          });
        });

      } else {
        deferred.resolve(notice);
      }

      return deferred.promise;

      // File items upload success callback
      function onUploadFileItemsSuccess(fileItem, callback) {
        fileItem.user = vm.auth.user._id;
        FileItem.saveFileItem(fileItem)
          .then((fileItem) => {
            onSaveFileItemSuccess(fileItem, callback);
          })
          .catch(onSaveFileItemError);
      }

      // File items upload error callback
      function onUploadFileItemsError(err) {
        deferred.reject(err);
      }

      // File items upload log create success callback
      function onSaveFileItemSuccess(fileItem, callback) {
        notice.attachmentFiles.push(fileItem._id);
        if (callback) {
          callback();
        }
      }

      // File items upload log create error callback
      function onSaveFileItemError(err) {
        deferred.reject(err);
      }
    }


    /**
     * Update notice information
     */
    function updateNotice(notice) {
      const deferred = $q.defer();

      notice.$update(onUpdateNoticeSuccess, onUpdateNoticeError);

      return deferred.promise;

      // Notice update success callback
      function onUpdateNoticeSuccess(notice) {
        deferred.resolve(notice);
      }

      // Notice update success callback
      function onUpdateNoticeError(err) {
        deferred.reject(err);
      }
    }
  }
}());

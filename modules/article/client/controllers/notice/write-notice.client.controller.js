(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('WriteNoticeController', WriteNoticeController);

  /**
   * Dependency Injection
   */
  WriteNoticeController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    '$timeout',
    'noticeResolve',
    'FileItem',
    'Upload',
    'Authentication',
    'summernoteConfig',
    'toastr'
  ];

  /**
   * Configuring the Notice write controller
   */
  function WriteNoticeController(
    $scope,
    $window,
    $state,
    $q,
    $timeout,
    notice,
    FileItem,
    Upload,
    Authentication,
    summernoteConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;

    vm.notice = notice;
    vm.cancelFile = cancelFile;
    vm.write = write;
    vm.summernoteOptions = summernoteConfig;

    if (vm.notice) {
      vm.notice.noticeType = 'normal';
      vm.notice.attachmentFiles = [];
    }

    function cancelFile(fileItemIndex) {
      if (vm.attachmentFiles && vm.attachmentFiles.length > 0) {
        vm.attachmentFiles.splice(fileItemIndex, 1);
      }
    }

    /**
     * Write Notice
     */
    function write(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.noticeForm');
        return false;
      }


      if ($window.confirm('Are you sure you want to write this notice?')) {

        fileUploads(vm.notice)
          .then(saveNotice)
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
     * Save notice promise
     */
    function saveNotice(notice) {
      const deferred = $q.defer();

      notice.user = vm.auth.user._id;
      notice.$save(onSaveNoticeSuccess, onSaveNoticeError);

      return deferred.promise;

      // Notice save success callback
      function onSaveNoticeSuccess(notice) {
        deferred.resolve(notice);
      }

      // Notice save error callback
      function onSaveNoticeError(err) {
        deferred.reject(err);
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
  }
}());


// function imageUpload(files, editor) {
//   Upload.upload({
//     url: 'api/file/upload/attach',
//     data: {
//       newAttachFiles: files[0]
//     }
//   }).then(function(resp) {
//     vm.editor.summernote('insertImage', `http://localhost:3000/uploads/attaches/${resp.data.filename}`, 'filename');
//
//
//   }, function(resp) {
//   });
// }

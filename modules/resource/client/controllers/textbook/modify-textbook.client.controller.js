(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('ModifyTextbookController', ModifyTextbookController);

  /**
   * Dependency Injection
   */
  ModifyTextbookController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    '$timeout',
    'textbookResolve',
    'FileItem',
    'Upload',
    'Authentication',
    'summernoteConfig',
    'toastr'
  ];

  /**
   * Configuring the Textbook modify controller
   */
  function ModifyTextbookController(
    $scope,
    $window,
    $state,
    $q,
    $timeout,
    textbook,
    FileItem,
    Upload,
    Authentication,
    summernoteConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;

    vm.modify = modify;
    vm.cancelFile = cancelFile;
    vm.summernoteOptions = summernoteConfig;
    vm.textbook = textbook;

    function cancelFile() {
      vm.textbookFile = undefined;
    }

    /**
     * Modify Textbook
     */
    function modify(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.textbookForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this textbook?')) {
        fileUploads(vm.textbook)
          .then(updateTextbook)
          .then((textbook) => {
            vm.textbook = textbook;
            $state.reload();
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
    function fileUploads(textbook) {
      const deferred = $q.defer();

      if (vm.textbookFile) {
        Upload.upload({
          url: '/api/file-item/upload',
          data: {
            newFileItem: vm.textbookFile,
            filterName: 'textbookFileFilter'
          }
        }).then((response) => {
          $timeout(() => {
            onUploadFileItemsSuccess(response.data);
          }, 1000);
        }, (response) => {
          // deferred.reject(err);
          if (response.status > 0) {
            onUploadFileItemsError(response);
          }
        }, (evt) => {
          vm.progress = parseInt((100.0 * evt.loaded) / evt.total, 10);
        });
      } else {
        deferred.resolve(textbook);
      }

      return deferred.promise;

      // File items upload success callback
      function onUploadFileItemsSuccess(fileItem) {
        fileItem.user = vm.auth.user._id;
        FileItem.saveFileItem(fileItem)
          .then(onSaveFileItemSuccess)
          .catch(onSaveFileItemError);
      }

      // File items upload error callback
      function onUploadFileItemsError(err) {
        deferred.reject(err);
      }

      // File items upload log create success callback
      function onSaveFileItemSuccess(fileItem) {
        textbook.textbookFile = fileItem._id;
        deferred.resolve(textbook);
      }

      // File items upload log create error callback
      function onSaveFileItemError(err) {
        deferred.reject(err);
      }
    }

    /**
     * Save textbook promise
     */
    function updateTextbook(textbook) {
      const deferred = $q.defer();

      textbook.$update()
        .then(onUpdateTextbookSuccess)
        .catch(onUpdateTextbookError);

      return deferred.promise;

      // Textbook update success callback
      function onUpdateTextbookSuccess(textbook) {
        deferred.resolve(textbook);
      }

      // Textbook update error callback
      function onUpdateTextbookError(err) {
        deferred.reject(err);
      }
    }

  }

}());

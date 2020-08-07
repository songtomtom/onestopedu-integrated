(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource')
    .controller('AddTextbookController', AddTextbookController);

  /**
   * Dependency Injection
   */
  AddTextbookController.$inject = [
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
   * Configuring the Textbook add controller
   */
  function AddTextbookController(
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

    vm.add = add;
    vm.cancelFile = cancelFile;
    vm.summernoteOptions = summernoteConfig;
    vm.textbook = textbook;

    function cancelFile(fileItemIndex) {
      vm.textbookFile = undefined;
    }

    /**
     * Write Textbook
     */
    function add(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.textbookForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to add this textbook?')) {

        fileUploads(vm.textbook)
          .then(saveTextbook)
          .then((textbook) => {
            $state.go('resource.textbook.read', {
              textbookId: textbook._id
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
    function saveTextbook(textbook) {
      const deferred = $q.defer();

      textbook.user = vm.auth.user._id;
      textbook.$save(onSaveTextbookSuccess, onSaveTextbookError);

      return deferred.promise;

      // Textbook save success callback
      function onSaveTextbookSuccess(textbook) {
        deferred.resolve(textbook);
      }

      // Textbook save error callback
      function onSaveTextbookError(err) {
        deferred.reject(err);
      }
    }
  }
}());

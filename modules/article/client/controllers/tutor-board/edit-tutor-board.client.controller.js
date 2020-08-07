(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('EditTutorBoardController', EditTutorBoardController);

  /**
   * Dependency Injection
   */
  EditTutorBoardController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    '$timeout',
    'tutorBoardResolve',
    'Tutor',
    'FileItem',
    'Upload',
    'Authentication',
    'summernoteConfig',
    'toastr'
  ];

  /**
   * Configuring the Daily Report edit controller
   */
  function EditTutorBoardController(
    $scope,
    $window,
    $state,
    $q,
    $timeout,
    tutorBoard,
    Tutor,
    FileItem,
    Upload,
    Authentication,
    summernoteConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.tutorBoard = tutorBoard;
    vm.edit = edit;
    vm.savedFiles = [];
    vm.removeFile = removeFile;
    vm.cancelFile = cancelFile;
    vm.tutors = Tutor.query();
    vm.summernoteOptions = summernoteConfig;
    vm.renderNation = renderNation;

    if (vm.tutorBoard.tutors) {
      vm.tutorBoard.tutors = vm.tutorBoard.tutors.map((tutor) => {
        return tutor._id;
      });
    }


    /**
     * Cancel File
     */
    function cancelFile(fileItemIndex) {
      if (vm.files && vm.files.length > 0) {
        vm.files.splice(fileItemIndex, 1);
      }
    }

    /**
     * Remove attachment File
     */
    function removeFile(fileItemIndex) {
      vm.tutorBoard.attachmentFiles.splice(fileItemIndex, 1);
    }

    /**
     * Render nation
     */
    function renderNation(nation) {

      vm.nation = nation;
      Tutor.nationByList({
          nation: vm.nation
        }).$promise
        .then((tutors) => {
          vm.tutorBoard.tutors = tutors.map((tutor) => {
            return tutor._id;
          });
        })
        .catch(onError);
    }

    /**
     * Daily Report Edit
     */
    function edit(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tutorBoardForm');
        return false;
      }


      if ($window.confirm('Are you sure you want to edit this tutor board?')) {

        fileUploads(vm.tutorBoard)
          .then(updateTutorBoard)
          .then((tutorBoard) => {
            $state.go('tutor.tutor-board.read', {
              tutorBoardId: tutorBoard._id
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
    function fileUploads(tutorBoard) {
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
                  deferred.resolve(tutorBoard);
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
        deferred.resolve(tutorBoard);
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
        tutorBoard.attachmentFiles.push(fileItem._id);
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
     * Update tutorBoard information
     */
    function updateTutorBoard(tutorBoard) {
      const deferred = $q.defer();

      tutorBoard.$update(onUpdateTutorBoardSuccess, onUpdateTutorBoardError);

      return deferred.promise;

      // TutorBoard update success callback
      function onUpdateTutorBoardSuccess(tutorBoard) {
        deferred.resolve(tutorBoard);
      }

      // TutorBoard update success callback
      function onUpdateTutorBoardError(err) {
        deferred.reject(err);
      }
    }

    /**
     * Update Daily Report Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }
  }
}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('WriteTutorBoardController', WriteTutorBoardController);

  /**
   * Dependency Injection
   */
  WriteTutorBoardController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$filter',
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
   * Configuring the Daily Report write controller
   */
  function WriteTutorBoardController(
    $scope,
    $window,
    $state,
    $filter,
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
    vm.search = {};
    vm.tutorBoard = tutorBoard;
    vm.tutors = Tutor.query();
    vm.write = write;
    vm.cancelFile = cancelFile;
    vm.summernoteOptions = summernoteConfig;
    vm.renderNation = renderNation;

    if (vm.tutorBoard) {
      vm.tutorBoard.attachmentFiles = [];
    }


    function cancelFile(fileItemIndex) {
      if (vm.attachmentFiles && vm.attachmentFiles.length > 0) {
        vm.attachmentFiles.splice(fileItemIndex, 1);
      }
    }

    /**
     * Write Daily Report
     */
    function write(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tutorBoardForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to write this daily report?')) {

        fileUploads(vm.tutorBoard)
          .then(saveTutorBoard)
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
     * Save tutorBoard promise
     */
    function saveTutorBoard(tutorBoard) {
      const deferred = $q.defer();

      tutorBoard.user = vm.auth.user._id;
      tutorBoard.$save(onSaveTutorBoardSuccess, onSaveTutorBoardError);

      return deferred.promise;

      // TutorBoard save success callback
      function onSaveTutorBoardSuccess(tutorBoard) {
        deferred.resolve(tutorBoard);
      }

      // TutorBoard save error callback
      function onSaveTutorBoardError(err) {
        deferred.reject(err);
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
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }

  }
}());

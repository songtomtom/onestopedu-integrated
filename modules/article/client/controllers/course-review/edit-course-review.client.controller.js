(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article')
    .controller('EditCourseReviewController', EditCourseReviewController);

  /**
   * Dependency Injection
   */
  EditCourseReviewController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    'courseReviewResolve',
    'Member',
    'Point',
    'Authentication',
    'summernoteConfig',
    'toastr'
  ];

  /**
   * Configuring the course review edit controller
   */
  function EditCourseReviewController(
    $scope,
    $window,
    $state,
    $q,
    courseReview,
    Member,
    Point,
    Authentication,
    summernoteConfig,
    toastr
  ) {

    const vm = this;

    vm.auth = Authentication;
    vm.courseReview = courseReview;
    vm.edit = edit;
    vm.payPoint = payPoint;
    vm.summernoteOptions = summernoteConfig;

    /**
     * give to point
     */
    function payPoint(type, amount) {
      const doc = {
        user: vm.courseReview.user._id,
        providers: vm.courseReview.providers,
        payer: vm.auth.user._id,
        amount,
        title: (type === 'write') ?
          'Pay for 2,000 points to the write course reviews' :
          'Pay for 3,000 points to the best course reviews'
      };

      savePoint(doc)
        .then(updateCourseReview)
        .then((courseReview) => {
          vm.courseReview = courseReview;
          $state.reload();
        })
        .catch((err) => {
          toastr.error(err.data.message, 'Error', {
            timeOut: 0
          });
        });

      /**
       * Save point promise
       */
      function savePoint(doc) {
        const deferred = $q.defer();

        Point.savePoint(doc)
          .then(onSavePointSuccess)
          .catch(onSavePointError);

        return deferred.promise;
        // Save point success callback
        function onSavePointSuccess(point) {
          deferred.resolve(point);
        }
        // Save point success callback
        function onSavePointError(err) {
          deferred.resolve(err);
        }

      }

      /**
       * Update course review promise
       */
      function updateCourseReview(point) {
        const deferred = $q.defer();

        if (type === 'write') {
          // earnning point of written course review
          vm.courseReview.writePoint = point._id;
        } else {
          // earnning point of top course review
          vm.courseReview.topPoint = point._id;
          vm.courseReview.courseReviewType = 'top';
        }

        vm.courseReview.$update()
          .then(onUpdateCourseReviewSuccess)
          .catch(onUpdateCourseReviewError);

        return deferred.promise;

        // Update course review success callback
        function onUpdateCourseReviewSuccess(point) {
          deferred.resolve(point);
        }

        // Update course review success error
        function onUpdateCourseReviewError(err) {
          deferred.resolve(err);
        }
      }
    }

    /**
     * Edit course review
     */
    function edit(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.courseReviewForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to edit this course review?')) {
        vm.courseReview.$update()
          .then(onUpdateCourseReviewSuccess)
          .catch(onUpdateCourseReviewError);
      }

      function onUpdateCourseReviewSuccess(courseReview) {
        $state.go('cs-center.course-review.read', {
          courseReviewId: courseReview._id
        });
      }

      function onUpdateCourseReviewError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }
  }
}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.routes')
    .config(routeConfig);

  /**
   * Dependency Injection
   */
  routeConfig.$inject = ['$stateProvider'];

  /**
   * Setting up route
   */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('cs-center.course-review', {
        abstract: true,
        url: '/course-review',
        template: '<ui-view/>'
      })
      .state('cs-center.course-review.list', {
        url: '/list',
        templateUrl: 'modules/article/client/views/course-review/list-course-review.client.view.html',
        controller: 'ListCourseReviewController',
        controllerAs: 'vm'
      })
      .state('cs-center.course-review.read', {
        url: '/:courseReviewId/read',
        templateUrl: 'modules/article/client/views/course-review/read-course-review.client.view.html',
        controller: 'ReadCourseReviewController',
        controllerAs: 'vm',
        resolve: {
          courseReviewResolve: getCourseReview,
          commentResolve: newComment
        }
      })
      .state('cs-center.course-review.edit', {
        url: '/:courseReviewId/edit',
        templateUrl: 'modules/article/client/views/course-review/edit-course-review.client.view.html',
        controller: 'EditCourseReviewController',
        controllerAs: 'vm',
        resolve: {
          courseReviewResolve: getCourseReview
        }
      });

    /** Dependency Injection */
    getCourseReview.$inject = ['$stateParams', 'CourseReview'];

    /**
     * Course Review resolve
     */
    function getCourseReview($stateParams, CourseReview) {
      return CourseReview.get({
        courseReviewId: $stateParams.courseReviewId
      }).$promise;
    }

    /** Dependency Injection */
    newComment.$inject = ['Comment'];

    /**
     * New Commnet resolve
     */
    function newComment(Comment) {
      return new Comment();
    }
  }
}());

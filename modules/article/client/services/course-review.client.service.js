(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.services')
    .factory('CourseReview', CourseReview);

  /**
   * Dependency Injection
   */
  CourseReview.$inject = ['$resource'];

  /**
   * Course Review service for REST endpoint
   */
  function CourseReview($resource) {
    return $resource('/api/course-review/:courseReviewId', {
      courseReviewId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('article.services')
    .factory('TutorBoard', TutorBoard);

  /**
   * Dependency Injection
   */
  TutorBoard.$inject = ['$resource'];

  /**
   * Daily Report service for REST endpoint
   */
  function TutorBoard($resource) {
    return $resource('/api/tutor-board/:tutorBoardId', {
      tutorBoardId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST',
        url: '/api/tutor-board',
        isArray: true,
        params: {
          tutorBoards: '='
        }
      }
    });
  }

}());

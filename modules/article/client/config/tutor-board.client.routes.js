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
      .state('tutor.tutor-board', {
        abstract: true,
        url: '/tutor-board',
        template: '<ui-view/>'
      })
      .state('tutor.tutor-board.list', {
        url: '/list',
        templateUrl: 'modules/article/client/views/tutor-board/list-tutor-board.client.view.html',
        controller: 'ListTutorBoardController',
        controllerAs: 'vm'
      })
      .state('tutor.tutor-board.read', {
        url: '/:tutorBoardId/read',
        templateUrl: 'modules/article/client/views/tutor-board/read-tutor-board.client.view.html',
        controller: 'ReadTutorBoardController',
        controllerAs: 'vm',
        resolve: {
          tutorBoardResolve: getTutorBoard,
          commentResolve: newComment
        }
      })
      .state('tutor.tutor-board.write', {
        url: '/write',
        templateUrl: 'modules/article/client/views/tutor-board/write-tutor-board.client.view.html',
        controller: 'WriteTutorBoardController',
        controllerAs: 'vm',
        resolve: {
          tutorBoardResolve: newTutorBoard
        }
      })
      .state('tutor.tutor-board.edit', {
        url: '/:tutorBoardId/edit',
        templateUrl: 'modules/article/client/views/tutor-board/edit-tutor-board.client.view.html',
        controller: 'EditTutorBoardController',
        controllerAs: 'vm',
        resolve: {
          tutorBoardResolve: getTutorBoard
        }
      });

    /** Dependency Injection */
    getTutorBoard.$inject = ['$stateParams', 'TutorBoard'];

    /**
     * Get tutor board resolve
     */
    function getTutorBoard($stateParams, TutorBoard) {
      return TutorBoard.get({
        tutorBoardId: $stateParams.tutorBoardId
      }).$promise;
    }

    /** Dependency Injection */
    newTutorBoard.$inject = ['TutorBoard'];

    /**
     * New tutor board resolve
     */
    function newTutorBoard(TutorBoard) {
      return new TutorBoard();
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

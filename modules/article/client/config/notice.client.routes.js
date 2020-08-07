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
      .state('cs-center.notice', {
        abstract: true,
        url: '/notice',
        template: '<ui-view/>'
      })
      .state('cs-center.notice.list', {
        url: '/list',
        templateUrl: 'modules/article/client/views/notice/list-notice.client.view.html',
        controller: 'ListNoticeController',
        controllerAs: 'vm'
      })
      .state('cs-center.notice.read', {
        url: '/:noticeId/read',
        templateUrl: 'modules/article/client/views/notice/read-notice.client.view.html',
        controller: 'ReadNoticeController',
        controllerAs: 'vm',
        resolve: {
          noticeResolve: getNotice
        }
      })
      .state('cs-center.notice.write', {
        url: '/write',
        templateUrl: 'modules/article/client/views/notice/write-notice.client.view.html',
        controller: 'WriteNoticeController',
        controllerAs: 'vm',
        resolve: {
          noticeResolve: newNotice
        }
      })
      .state('cs-center.notice.edit', {
        url: '/:noticeId/edit',
        templateUrl: 'modules/article/client/views/notice/edit-notice.client.view.html',
        controller: 'EditNoticeController',
        controllerAs: 'vm',
        resolve: {
          noticeResolve: getNotice
        }
      });

    /** Dependency Injection */
    getNotice.$inject = ['$stateParams', 'Notice'];

    /**
     * Get Notice resolve
     */
    function getNotice($stateParams, Notice) {
      return Notice.get({
        noticeId: $stateParams.noticeId
      }).$promise;
    }

    /** Dependency Injection */
    newNotice.$inject = ['Notice'];

    /**
     * New Notice resolve
     */
    function newNotice(Notice) {
      return new Notice();
    }
  }

}());

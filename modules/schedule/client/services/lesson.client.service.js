(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule.services')
    .factory('Lesson', Lesson);

  /**
   * Dependency Injection
   */
  Lesson.$inject = ['$resource'];

  /**
   * Lesson resource service for REST end Lesson
   */
  function Lesson($resource) {
    const service = $resource('/api/lesson/:lessonId', {
      lessonId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      next: {
        method: 'GET',
        url: '/api/lesson/next/:lessonId',
        params: {
          lessonId: '='
        }
      },
      previous: {
        method: 'GET',
        url: '/api/lesson/previous/:lessonId',
        params: {
          lessonId: '='
        }
      },
      recent: {
        method: 'GET',
        url: '/api/lesson/recent/:memberId',
        params: {
          memberId: '='
        }
      },
      create: {
        method: 'POST',
        url: '/api/lesson/course',
        isArray: true
      },
      change: {
        method: 'POST',
        url: '/api/lesson/course/:courseId/:state',
        isArray: true,
        params: {
          courseId: '=',
          state: '='
        }
      },
      hold: {
        method: 'GET',
        url: '/api/lesson/hold/:lessonId',
        isArray: true,
        params: {
          lessonId: '='
        }
      },
      unHold: {
        method: 'GET',
        url: '/api/lesson/un-hold/:courseId',
        isArray: true,
        params: {
          courseId: '='
        }
      },
      postpone: {
        method: 'POST',
        url: '/api/lesson/postpone/:lessonId',
        params: {
          lessonId: '='
        }
      },
      revert: {
        method: 'GET',
        url: '/api/lesson/revert/:lessonId',
        params: {
          lessonId: '='
        }
      },
      listByMemberId: {
        method: 'GET',
        url: '/api/lesson/member/:memberId',
        isArray: true,
        params: {
          memberId: '='
        }
      },
      listByCourseId: {
        method: 'GET',
        url: '/api/lesson/course/:courseId',
        isArray: true,
        params: {
          courseId: '='
        }
      },
      dateByList: {
        method: 'POST',
        url: '/api/lesson/date',
        isArray: true
      }
    });

    angular.extend(service, {
      changeLessons,
      createLessons,
      findByCourseId,
      findOne,
      findOneByNext,
      findOneByPrevious,
      findOneByRecent,
      holdLessons,
      postponeLesson,
      revertPostpone,
      unHoldLessons
    });

    return service;

    /** Find lesson */
    function findOne(lessonId) {
      return this.get({
        lessonId
      }).$promise;
    }

    /**
     * Lesson to postpone
     */
    function postponeLesson(postponeId, doc) {
      return this.postpone({
          lessonId: postponeId
        }, doc)
        .$promise;
    }

    /** Revert Postpone */
    function revertPostpone(postponeId) {
      return this.revert({
        lessonId: postponeId
      }).$promise;
    }

    /** Hold lessons */
    function holdLessons(lessonId) {
      return this.hold({
        lessonId
      }).$promise;
    }

    /** Un hold lessons */
    function unHoldLessons(courseId) {
      return this.unHold({
        courseId
      }).$promise;
    }

    /** Remove lessons, next create feedback, lessons */
    function changeLessons(state, courseId, docs) {
      return this.change({
          state,
          courseId
        }, docs)
        .$promise;
    }

    /** Create feedback, lessons */
    function createLessons(docs) {
      return this.create(docs)
        .$promise;
    }

    /** Find one by last lesson */
    function findOneByRecent(memberId) {
      return this.recent({
        memberId
      }).$promise;
    }

    /** Find by next lesson */
    function findOneByNext(lessonId) {
      return this.next({
        lessonId
      }).$promise;
    }

    /** Find by previous lesson */
    function findOneByPrevious(lessonId) {
      return this.previous({
        lessonId
      }).$promise;
    }

    /** Find by course */
    function findByCourseId(courseId) {
      return this.listByCourseId({
        courseId
      }).$promise;
    }
  }
}());

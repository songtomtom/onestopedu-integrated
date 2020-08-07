(function() {

  /**
   * Module Configuration
   */
  angular
    .module('resource.services')
    .factory('TalkDream', TalkDream);

  /**
   * Dependency Injection
   */
  TalkDream.$inject = ['$resource'];

  /**
   * Send message service for REST end talk-dream(KAKO)
   */
  function TalkDream($resource) {
    const service = $resource('/api/talk-dream', {}, {

      /**
       * 10003 Sign up member
       */
      sendToTemplateBy10003: {
        method: 'GET',
        url: '/api/talk-dream/10003/:memberId',
        params: {
          memberId: '='
        }
      },

      /**
       * 10004 Apply to leveltest(telephone)
       */
      sendToTemplateBy10004: {
        method: 'GET',
        url: '/api/talk-dream/10004/:userId/:leveltestId',
        params: {
          userId: '=',
          leveltestId: '='
        }
      },

      /**
       * 10005 Apply to leveltest(skype)
       */
      sendToTemplateBy10005: {
        method: 'GET',
        url: '/api/talk-dream/10005/:userId/:leveltestId',
        params: {
          userId: '=',
          leveltestId: '='
        }
      },

      /**
       * 10006 Apply to leveltest(screen board)
       */
      sendToTemplateBy10006: {
        method: 'GET',
        url: '/api/talk-dream/10006/:userId/:leveltestId',
        params: {
          userId: '=',
          leveltestId: '='
        }
      },

      /**
       * 10007 무료체험-10분전
       */
      sendToTemplateBy10007: {
        method: 'POST',
        url: '/api/talk-dream/10007'
      },

      /**
       * 10009 수강신청-카드결제
       */
      sendToTemplateBy10009: {
        method: 'POST',
        url: '/api/talk-dream/10009'
      },

      /**
       * 10010 수강신청-무통장입금
       */
      sendToTemplateBy10010: {
        method: 'POST',
        url: '/api/talk-dream/10010'
      },

      /**
       * 10011 수강신청-ARS결제
       */
      sendToTemplateBy10011: {
        method: 'POST',
        url: '/api/talk-dream/10011'
      },

      /**
       * 10012 수강신청-SMS결제
       */
      sendToTemplateBy10012: {
        method: 'POST',
        url: '/api/talk-dream/10012'
      },

      /**
       * 10016 수업 10분전
       */
      sendToTemplateBy10016: {
        method: 'POST',
        url: '/api/talk-dream/10016'
      },

      /*
       * 10024 무료체험-결과
       */
      sendToTemplateBy10024: {
        method: 'POST',
        url: '/api/talk-dream/10024'
      },

      /**
       * 10032 피드백
       */
      sendToTemplateBy10032: {
        method: 'POST',
        url: '/api/talk-dream/10032'
      },

      /**
       * 10036 무료체험-N분전
       */
      sendToTemplateBy10036: {
        method: 'POST',
        url: '/api/talk-dream/10036'
      }
    });

    angular.extend(service, {
      // 10003
      sendMessageToSignup,
      // 10004, 10005, 10006
      sendMessageToApplyLeveltest,
      sendMessageTo10007,
      sendMessageTo10009,
      sendMessageTo10010,
      sendMessageTo10011,
      sendMessageTo10012,
      sendMessageTo10016,
      sendMessageTo10024,
      sendMessageTo10032,
      sendMessageTo10036
    });

    function sendMessageToSignup(memberId) {
      return this.sendToTemplateBy10003({
        memberId
      }).$promise;
    }

    function sendMessageToApplyLeveltest(productType, userId, leveltestId) {
      if (productType === 'telephone') {
        return this.sendToTemplateBy10004({
          userId,
          leveltestId
        }).$promise;
      } else if (productType === 'skype') {
        return this.sendToTemplateBy10005({
          userId,
          leveltestId
        }).$promise;
      } else if (productType === 'screenBoard') {
        return this.sendToTemplateBy10006({
          userId,
          leveltestId
        }).$promise;
      }
    }

    function sendMessageTo10007(replacementDetails) {
      return this.sendToTemplateBy10007(replacementDetails).$promise;
    }

    function sendMessageTo10009(replacementDetails) {
      return this.sendToTemplateBy10009(replacementDetails).$promise;
    }

    function sendMessageTo10010(replacementDetails) {
      return this.sendToTemplateBy10010(replacementDetails).$promise;
    }

    function sendMessageTo10011(replacementDetails) {
      return this.sendToTemplateBy10011(replacementDetails).$promise;
    }

    function sendMessageTo10012(replacementDetails) {
      return this.sendToTemplateBy10012(replacementDetails).$promise;
    }

    function sendMessageTo10016(replacementDetails) {
      return this.sendToTemplateBy10016(replacementDetails).$promise;
    }

    function sendMessageTo10024(replacementDetails) {
      return this.sendToTemplateBy10024(replacementDetails).$promise;
    }


    function sendMessageTo10032(replacementDetails) {
      return this.sendToTemplateBy10032(replacementDetails).$promise;
    }

    function sendMessageTo10036(replacementDetails) {
      return this.sendToTemplateBy10036(replacementDetails).$promise;
    }


    return service;
  }
}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user.routes')
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
      .state('member', {
        abstract: true,
        url: '/member',
        template: '<ui-view/>'
      })
      .state('member.list', {
        url: '/list',
        templateUrl: 'modules/user/client/views/member/list-member.client.view.html',
        controller: 'ListMemberController',
        controllerAs: 'vm'
      })
      .state('member.view', {
        abstract: true,
        url: '/:memberId/view',
        controller: 'ViewMemberController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/member/view-member.client.view.html',
        resolve: {
          memberResolve: getMember
        },
        data: {
          pageContentFullHeight: true,
          pageContentFullWidth: true
        }
      })
      .state('member.view.modify', {
        url: '/modify',
        controller: 'ModifyMemberController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/member/modify-member.client.view.html'
      })

      .state('member.view.calendar', {
        url: '/calendar',
        controller: 'CalendarMemberController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/member/calendar-member.client.view.html'
      })

      .state('member.view.leveltest', {
        abstract: true,
        url: '/leveltest',
        template: '<ui-view/>'
      })
      .state('member.view.leveltest.regist', {
        url: '/regist',
        templateUrl: 'modules/user/client/views/member/leveltest/regist-leveltest-by-member.client.view.html',
        controller: 'RegistLeveltestByMemberController',
        controllerAs: 'vm',
        resolve: {
          leveltestResolve: newLeveltest
        }
      })
      .state('member.view.leveltest.list', {
        url: '/list',
        controller: 'ListLeveltestByMemberController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/member/leveltest/list-leveltest-by-member.client.view.html'
      })
      .state('member.view.leveltest.list.detail', {
        url: '/:leveltestId/detail',
        controller: 'DetailMemberLeveltestController',
        controllerAs: 'vm',
        templateUrl: 'modules/schedule/client/views/leveltest/member/detail-member-leveltest.client.view.html',
        resolve: {
          leveltestResolve: getLeveltest,
          assessmentResolve: getAssessment,
          commentResolve: newComment
        }
      })

      .state('member.view.payment', {
        abstract: true,
        url: '/payment',
        template: '<ui-view/>'
      })

      .state('member.view.payment.virtual', {
        url: '/virtual',
        templateUrl: 'modules/user/client/views/member/payment/virtual-payment-by-member.client.view.html',
        controller: 'VirtualPaymentByMemberController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: newPayment
        }
      })

      .state('member.view.payment.list', {
        url: '/list',
        controller: 'ListPaymentByMemberController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/member/payment/list-payment-by-member.client.view.html'
      })
      .state('member.view.payment.list.detail', {
        url: '/:paymentId/detail',
        controller: 'DetailPaymentController',
        controllerAs: 'vm',
        templateUrl: 'modules/resource/client/views/payment/detail-payment.client.view.html',
        resolve: {
          paymentResolve: getPayment,
          refundResolve: getOrNewRefund
        }
      })

      .state('member.view.course', {
        abstract: true,
        url: '/course',
        template: '<ui-view/>'
      })
      .state('member.view.course.regist', {
        url: '/:paymentId/regist',
        templateUrl: 'modules/schedule/client/views/course/regist-course.client.view.html',
        controller: 'RegistCourseController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        }
      })
      .state('member.view.course.list', {
        url: '/list',
        controller: 'ListCourseByMemberController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/member/course/list-course-by-member.client.view.html'
      })
      .state('member.view.course.list.detail', {
        url: '/:courseId/detail',
        controller: 'DetailCourseController',
        controllerAs: 'vm',
        templateUrl: 'modules/schedule/client/views/course/detail-course.client.view.html',
        resolve: {
          courseResolve: getCourse,
          lessonsResolve: getLessons,
          monthliesResolve: getMonthlies
        }
      })


      .state('member.view.hold', {
        abstract: true,
        url: '/hold',
        template: '<ui-view/>'
      })
      .state('member.view.hold.regist', {
        url: '/:courseId/regist',
        templateUrl: 'modules/schedule/client/views/hold/regist-hold.client.view.html',
        controller: 'RegistHoldController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          lessonsResolve: getLessons,
          holdResolve: newHold
        }
      })
      .state('member.view.hold.detail', {
        url: '/:courseId/detail',
        templateUrl: 'modules/schedule/client/views/hold/detail-hold.client.view.html',
        controller: 'DetailHoldController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          lessonsResolve: getLessons,
          holdResolve: getHold
        }
      })
      .state('member.view.hold.re-regist', {
        url: '/:courseId/re-regist',
        templateUrl: 'modules/schedule/client/views/hold/re-regist-hold.client.view.html',
        controller: 'ReRegistHoldController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          lessonsResolve: getLessons,
          holdResolve: getHold
        }
      })

      .state('member.view.lesson', {
        abstract: true,
        url: '/lesson',
        template: '<ui-view/>'
      })

      .state('member.view.lesson.add', {
        url: '/:courseId/add',
        templateUrl: 'modules/schedule/client/views/lesson/add-lesson.client.view.html',
        controller: 'AddLessonController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          lessonResolve: newLesson
        }
      })

      .state('member.view.lesson.detail', {
        url: '/:lessonId/detail',
        controller: 'DetailLessonController',
        controllerAs: 'vm',
        templateUrl: 'modules/schedule/client/views/lesson/detail-lesson.client.view.html',
        resolve: {
          lessonResolve: getLesson,
          feedbackResolve: getFeedback,
          commentResolve: newComment
        }
      })

      .state('member.view.lesson.postpone', {
        url: '/:lessonId/postpone',
        templateUrl: 'modules/schedule/client/views/lesson/postpone-lesson.client.view.html',
        controller: 'PostponeLessonController',
        controllerAs: 'vm',
        resolve: {
          postponeResolve: getLesson
        }
      })

      .state('member.view.monthly', {
        abstract: true,
        url: '/monthly',
        template: '<ui-view/>'
      })

      .state('member.view.monthly.add', {
        url: '/:courseId/add',
        templateUrl: 'modules/user/client/views/member/monthly/add-monthly-by-member.client.view.html',
        controller: 'AddMonthlyByMemberController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse,
          monthlyResolve: newMonthly
        }
      })
      .state('member.view.monthly.list', {
        url: '/list',
        controller: 'ListMonthlyByMemberController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/member/monthly/list-monthly-by-member.client.view.html'
      })
      .state('member.view.monthly.list.detail', {
        url: '/:monthlyId/detail',
        controller: 'DetailMonthlyController',
        controllerAs: 'vm',
        templateUrl: 'modules/schedule/client/views/monthly/detail-monthly.client.view.html',
        resolve: {
          monthlyResolve: getMonthly,
          evaluationResolve: getEvaluation,
          commentResolve: newComment
        }
      })

      .state('member.view.coupon', {
        abstract: true,
        url: '/coupon',
        template: '<ui-view/>'
      })
      .state('member.view.coupon.list', {
        url: '/list',
        templateUrl: 'modules/user/client/views/member/coupon/list-coupon-by-member.client.view.html',
        controller: 'ListCouponByMemberController',
        controllerAs: 'vm'
      })
      .state('member.view.coupon.add', {
        url: '/add',
        templateUrl: 'modules/user/client/views/member/coupon/add-coupon-by-member.client.view.html',
        controller: 'AddCouponByMemberController',
        controllerAs: 'vm'
      })
      .state('member.view.coupon.modify', {
        url: '/:couponId/modify',
        templateUrl: 'modules/user/client/views/member/coupon/modify-coupon-by-member.client.view.html',
        controller: 'ModifyCouponByMemberController',
        controllerAs: 'vm',
        resolve: {
          couponResolve: getCoupon
        }
      })



      .state('member.view.point', {
        abstract: true,
        url: '/point',
        template: '<ui-view/>'
      })
      .state('member.view.point.list', {
        url: '/list',
        templateUrl: 'modules/user/client/views/member/point/list-point-by-member.client.view.html',
        controller: 'ListPointByMemberController',
        controllerAs: 'vm'
      })
      .state('member.view.point.pay', {
        url: '/pay',
        templateUrl: 'modules/user/client/views/member/point/pay-point-by-member.client.view.html',
        controller: 'PayPointByMemberController',
        controllerAs: 'vm',
        resolve: {
          pointResolve: newPoint
        }
      })

      .state('member.view.contact-1x1', {
        abstract: true,
        url: '/contact-1x1',
        template: '<ui-view/>'
      })
      .state('member.view.contact-1x1.list', {
        url: '/list',
        controller: 'ListContact1x1ByMemberController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/member/contact-1x1/list-contact-1x1-by-member.client.view.html'
      })

      .state('member.view.contact-1x1.read', {
        url: '/:contact1x1Id/read',
        controller: 'ReadContact1x1ByMemberController',
        controllerAs: 'vm',
        templateUrl: 'modules/user/client/views/member/contact-1x1/read-contact-1x1-by-member.client.view.html',
        resolve: {
          contact1x1Resolve: getContact1x1,
          commentResolve: newComment
        }
      })

      .state('member.hold', {
        abstract: true,
        url: '/hold',
        template: '<ui-view/>'
      })
      .state('member.hold.list', {
        url: '/list',
        templateUrl: 'modules/schedule/client/views/hold/list-hold.client.view.html',
        controller: 'ListHoldController',
        controllerAs: 'vm'
      })

      .state('member.list-finishing', {
        url: '/list-finishing',
        templateUrl: 'modules/user/client/views/member/list-finishing-member.client.view.html',
        controller: 'ListFinishingMemberController',
        controllerAs: 'vm'
      })
      .state('member.list-absence', {
        url: '/list-absence',
        templateUrl: 'modules/user/client/views/member/list-absence-member.client.view.html',
        controller: 'ListAbsenceMemberController',
        controllerAs: 'vm'
      })
      .state('member.signup', {
        url: '/signup',
        templateUrl: 'modules/user/client/views/member/signup-member.client.view.html',
        controller: 'SignupMemberController',
        controllerAs: 'vm',
        resolve: {
          memberResolve: newMember
        }
      });

    /** Dependency Injection */
    newMember.$inject = ['Member'];

    /**
     * New Member resolve
     */
    function newMember(Member) {
      return new Member();
    }

    /** Dependency Injection */
    getMember.$inject = ['$stateParams', 'Member'];

    /**
     * Get Member resolve
     */
    function getMember($stateParams, Member) {
      return Member.get({
        memberId: $stateParams.memberId
      }).$promise;
    }

    /** Dependency Injection */
    getPayment.$inject = ['$stateParams', 'Payment'];

    /**
     * Get Payment resolve
     */
    function getPayment($stateParams, Payment) {
      return Payment.get({
        paymentId: $stateParams.paymentId
      }).$promise;
    }

    /** Dependency Injection */
    getLeveltest.$inject = ['$stateParams', 'Leveltest'];

    /**
     * Get Leveltest resolve
     */
    function getLeveltest($stateParams, Leveltest) {
      return Leveltest.get({
        leveltestId: $stateParams.leveltestId
      }).$promise;
    }

    /** Dependency Injection */
    getCourse.$inject = ['$stateParams', 'Course'];

    /**
     * Get Course resolve
     */
    function getCourse($stateParams, Course) {
      return Course.get({
        courseId: $stateParams.courseId
      }).$promise;
    }

    /** Dependency Injection */
    newHold.$inject = ['$stateParams', 'Hold'];

    /**
     * New Hold resolve
     */
    function newHold($stateParams, Hold) {
      return new Hold();
    }

    /** Dependency Injection */
    getHold.$inject = ['$stateParams', 'Course', 'Hold'];

    /**
     * Get Hold resolve
     */
    function getHold($stateParams, Course, Hold) {
      return Course.get({
          courseId: $stateParams.courseId
        }).$promise
        .then(onSuccess);

      /** Course success callback */
      function onSuccess(course) {
        return Hold.get({
          holdId: course.hold._id || course.hold
        }).$promise;
      }
    }

    /** Dependency Injection */
    getAssessment.$inject = ['$stateParams', 'Leveltest', 'Assessment'];

    /**
     * Get Assessment resolve
     */
    function getAssessment($stateParams, Leveltest, Assessment) {
      return Leveltest.get({
          leveltestId: $stateParams.leveltestId
        }).$promise
        .then(onSuccess);

      /** Success callback */
      function onSuccess(leveltest) {
        return Assessment.get({
          assessmentId: leveltest.assessment._id || leveltest.assessment
        }).$promise;
      }
    }

    /** Dependency Injection */
    getOrNewRefund.$inject = ['$stateParams', 'Payment', 'Refund'];

    /**
     * Get or New Refund resolve
     */
    function getOrNewRefund($stateParams, Payment, Refund) {
      return Payment.get({
          paymentId: $stateParams.paymentId
        }).$promise
        .then(onSuccess);

      /** Payment success callback */
      function onSuccess(payment) {
        if (payment.refund) {
          return Refund.get({
            refundId: payment.refund._id || payment.refund
          }).$promise;
        } else {
          return new Refund();
        }
      }
    }

    /** Dependency Injection */
    newComment.$inject = ['Comment'];

    /**
     * New Commnet resolve
     */
    function newComment(Comment) {
      return new Comment();
    }

    /** Dependency Injection */
    getMonthly.$inject = ['$stateParams', 'Monthly'];

    /**
     * Get Monthly resolve
     */
    function getMonthly($stateParams, Monthly) {
      return Monthly.get({
        monthlyId: $stateParams.monthlyId
      }).$promise;
    }

    /** Dependency Injection */
    newMonthly.$inject = ['Monthly'];

    /**
     * New Monthly resolve
     */
    function newMonthly(Monthly) {
      return new Monthly();
    }

    /** Dependency Injection */
    getEvaluation.$inject = ['$stateParams', 'Monthly', 'Evaluation'];

    /**
     * Get or New Evaluation resolve
     */
    function getEvaluation($stateParams, Monthly, Evaluation) {
      return Monthly.get({
          monthlyId: $stateParams.monthlyId
        }).$promise
        .then(onSuccess);

      /** Success callback */
      function onSuccess(monthly) {
        return Evaluation.get({
          evaluationId: monthly.evaluation._id
        }).$promise;
      }
    }

    /** Dependency Injection */
    getLesson.$inject = ['$stateParams', 'Lesson'];

    /**
     * Get Lesson resolve
     */
    function getLesson($stateParams, Lesson) {
      return Lesson.get({
        lessonId: $stateParams.lessonId
      }).$promise;
    }

    /** Dependency Injection */
    getLessons.$inject = ['$stateParams', 'Lesson'];

    /**
     * Get Lesson list resolve
     */
    function getLessons($stateParams, Lesson) {
      return Lesson.listByCourseId({
        courseId: $stateParams.courseId
      }).$promise;
    }

    /** Dependency Injection */
    getMonthlies.$inject = ['$stateParams', 'Monthly'];

    /**
     * Get Monthly list resolve
     */
    function getMonthlies($stateParams, Monthly) {
      return Monthly.listByCourseId({
        courseId: $stateParams.courseId
      }).$promise;
    }

    /** Dependency Injection */
    newLesson.$inject = ['Lesson'];

    /**
     * New Lesson resource resolve
     */
    function newLesson(Lesson) {
      return new Lesson();
    }

    /** Dependency Injection */
    getFeedback.$inject = ['$stateParams', 'Lesson', 'Feedback'];

    /**
     * Get or New Feedback resolve
     */
    function getFeedback($stateParams, Lesson, Feedback) {
      return Lesson.get({
          lessonId: $stateParams.lessonId
        }).$promise
        .then(onSuccess);

      /** Success callback */
      function onSuccess(lesson) {
        return Feedback.get({
          feedbackId: lesson.feedback._id
        }).$promise;
      }
    }

    /** Dependency Injection */
    newPoint.$inject = ['Point'];

    /**
     * New Point resource resolve
     */
    function newPoint(Point) {
      return new Point();
    }

    /** Dependency Injection */
    newPayment.$inject = ['Payment'];

    /**
     * New Payment resolve
     */
    function newPayment(Payment) {
      return new Payment();
    }

    /** Dependency Injection */
    newLeveltest.$inject = ['Leveltest'];

    /**
     * New Leveltest resolve
     */
    function newLeveltest(Leveltest) {
      return new Leveltest();
    }

    /** Dependency Injection */
    getContact1x1.$inject = ['$stateParams', 'Contact1x1'];

    /**
     * Get Contact1x1 resolve
     */
    function getContact1x1($stateParams, Contact1x1) {
      return Contact1x1.get({
        contact1x1Id: $stateParams.contact1x1Id
      }).$promise;
    }

    /** Dependency Injection */
    getCoupon.$inject = ['$stateParams', 'Coupon'];

    /**
     * Get Coupon resource resolve
     */
    function getCoupon($stateParams, Coupon) {
      return Coupon.get({
        couponId: $stateParams.couponId
      }).$promise;
    }
  }

}());

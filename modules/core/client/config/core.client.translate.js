(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .config(translateConfig);

  /**
   * Dependency Injection
   */
  translateConfig.$inject = ['$translateProvider'];

  /**
   * Setting up route
   */
  function translateConfig($translateProvider) {

    $translateProvider

      /**
       * English
       */
      .translations('en', {

        /**
         * Menu - Member
         */
        MENU_MEMBER: 'Member Management',
        MENU_MEMBER_LIST: 'Member List',
        MENU_MEMBER_ABSENTED: 'Consecutive Absences',
        MENU_MEMBER_FINISHING: 'Lessons Due for Completion',
        MENU_MEMBER_HOLD: 'Hold List',

        /**
         * Menu - Guest
         */
        MENU_GUEST: 'Guest Management',

        /**
         * Menu - Tutor
         */
        MENU_TUTOR: 'Tutor Management',
        MENU_TUTOR_LIST: 'Tutor List',
        MENU_TUTOR_BOARD: 'Tutor Board',

        /**
         * Menu - Schedule
         */
        MENU_SCHEDULE: 'Schedule Status',
        MENU_SCHEDULE_CALENDAR: 'Weekly/Daily Calendar',
        MENU_SCHEDULE_DAILY: 'Daily Schedules',
        MENU_SCHEDULE_COURSE: 'Course Management',
        MENU_SCHEDULE_LESSON: 'Lesson List',
        MENU_SCHEDULE_LEVELTEST: 'Leveltest/Application Status',
        MENU_SCHEDULE_MONTHLY: 'Monthly Evaluations',

        /**
         * Menu - Payment
         */
        MENU_PAYMENT: 'Payment Management',

        /**
         * Menu - CS Center
         */
        MENU_CS_CENTER: 'CS Center',
        MENU_CS_CENTER_CONTACT_US: 'Contact Us Board',
        MENU_CS_CENTER_COURSE_REVIEW: 'Course Review Board',
        MENU_CS_CENTER_NOTICE: 'Notice Board',
        MENU_CS_CENTER_FAQ: 'FAQ(Frequently Asked Questions) List',
        MENU_CS_CENTER_PARTNERSHIP: 'Partnership Board',
        MENU_CS_CENTER_CONTACT_1X1: '1:1 Contact Board',

        /**
         * Menu - Resource
         */
        MENU_RESOURCE: 'Resource Management',
        MENU_RESOURCE_PRODUCT: 'Product List',
        MENU_RESOURCE_TEXTBOOK: 'Textbook List',
        MENU_RESOURCE_COUPON: 'Coupon Management',
        MENU_RESOURCE_POINT: 'Point Management',
        MENU_RESOURCE_HOLIDAY: 'Holiday Setting',
        MENU_RESOURCE_PROVIDER: 'Provider Status',
        MENU_RESOURCE_SUREM: 'SMS(Surem) Log',
        MENU_RESOURCE_TALK_DREAM: 'SMS(Talk Dream) Log',

        /**
         * Menu - Homepage
         */
        MENU_HOMEPAGE: 'Homepage Setting',
        MENU_HOMEPAGE_EVENT_BANNER: 'Event Banner List',
        MENU_HOMEPAGE_TUTOR_PROFILE: 'Tutor Profile List',

        /**
         * Menu - Salary
         */
        MENU_SALARY: 'Salary'



      })

      /**
       * Korean
       */
      .translations('ko', {


        /**
         * Menu - Member
         */
        MENU_MEMBER: '회원 관리',
        MENU_MEMBER_LIST: '회원 목록',
        MENU_MEMBER_ABSENTED: '연속 결석',
        MENU_MEMBER_FINISHING: '수업 종료 임박',
        MENU_MEMBER_HOLD: '홀딩 목록',

        /**
         * Menu - Guest
         */
        MENU_GUEST: '비회원 관리',

        /**
         * Menu - Tutor
         */
        MENU_TUTOR: '강사 관리',
        MENU_TUTOR_LIST: '강사 목록',
        MENU_TUTOR_BOARD: '강사 게시판',

        /**
         * Menu - Schedule
         */
        MENU_SCHEDULE: '일정',
        MENU_SCHEDULE_CALENDAR: '달력',
        MENU_SCHEDULE_DAILY: '일일 일정',
        MENU_SCHEDULE_COURSE: '수업 관리',
        MENU_SCHEDULE_LESSON: '전체 수업 목록',
        MENU_SCHEDULE_LEVELTEST: '레벨테스트 현황',
        MENU_SCHEDULE_MONTHLY: '월평가',

        /**
         * Menu - Payment
         */
        MENU_PAYMENT: '결제 관리',

        /**
         * Menu - CS Center
         */
        MENU_CS_CENTER: 'CS 센터',
        MENU_CS_CENTER_CONTACT_US: '문의하기',
        MENU_CS_CENTER_COURSE_REVIEW: '수강후기',
        MENU_CS_CENTER_NOTICE: '공지사항',
        MENU_CS_CENTER_FAQ: '자주하는 질문/답변',
        MENU_CS_CENTER_PARTNERSHIP: '제휴 문의',
        MENU_CS_CENTER_CONTACT_1X1: '1:1 담당강사 문의',

        /**
         * Menu - Resource
         */
        MENU_RESOURCE: ' 자원 관리',
        MENU_RESOURCE_PRODUCT: '상품 관리',
        MENU_RESOURCE_TEXTBOOK: '교재 관리',
        MENU_RESOURCE_COUPON: '쿠폰',
        MENU_RESOURCE_POINT: '포인트',
        MENU_RESOURCE_HOLIDAY: '휴일 설정',
        MENU_RESOURCE_PROVIDER: '업체 관리',
        MENU_RESOURCE_SUREM: 'SMS(SUREM) 전송 로그',
        MENU_RESOURCE_TALK_DREAM: 'SMS(TALK DREAM) 전송 로그',

        /**
         * Menu - Homepage
         */
        MENU_HOMEPAGE: '홈페이지 설정',
        MENU_HOMEPAGE_EVENT_BANNER: '이벤트 배너',
        MENU_HOMEPAGE_TUTOR_PROFILE: '강사 소개 관리',

        /**
         * Menu - Salary
         */
        MENU_SALARY: '급여'


      })

      /**
       * Chinese
       */
      .translations('cn', {

      });

    $translateProvider.preferredLanguage('en');

  }
}());

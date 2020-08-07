(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .run(menuConfig);

  /**
   * Dependency Injection
   */
  menuConfig.$inject = ['Menu'];

  /**
   * Setting up menu config
   */
  function menuConfig(Menu) {

    const vm = this;

    /**
     * Member menus
     */
    Menu.addMenuItem('sidebar', {
      title: 'MENU_MEMBER',
      state: 'member',
      iconClass: 'fa-users',
      type: 'dropdown',
      roles: ['creator', 'admin', 'csManager', 'tutorManager'],
      position: 10
    });

    Menu.addSubMenuItem('sidebar', 'member', {
      title: 'MENU_MEMBER_LIST',
      state: 'member.list',
      roles: ['creator', 'admin', 'csManager', 'tutorManager']
    });

    // Menu.addSubMenuItem('sidebar', 'member', {
    //   title: 'MENU_MEMBER_ABSENTED',
    //   state: 'member.list-absence',
    //   roles: ['creator', 'admin', 'csManager', 'tutorManager']
    // });
    //
    // Menu.addSubMenuItem('sidebar', 'member', {
    //   title: 'MENU_MEMBER_FINISHING',
    //   state: 'member.list-finishing',
    //   roles: ['creator', 'admin', 'csManager', 'tutorManager']
    // });

    Menu.addSubMenuItem('sidebar', 'member', {
      title: 'MENU_MEMBER_HOLD',
      state: 'member.hold.list',
      roles: ['creator', 'admin', 'csManager', 'tutorManager']
    });

    /**
     * Guest menus
     */
    Menu.addMenuItem('sidebar', {
      title: 'MENU_GUEST',
      state: 'guest.list',
      iconClass: 'fa-user-times',
      roles: ['creator', 'admin', 'csManager', 'tutorManager'],
      position: 16
    });

    /**
     * Tutor menus
     */
    Menu.addMenuItem('sidebar', {
      title: 'MENU_TUTOR',
      state: 'tutor',
      iconClass: 'fa-chalkboard-teacher',
      type: 'dropdown',
      roles: ['creator', 'admin', 'csManager', 'tutorManager'],
      position: 20
    });

    Menu.addSubMenuItem('sidebar', 'tutor', {
      title: 'MENU_TUTOR_LIST',
      state: 'tutor.list',
      roles: ['creator', 'admin', 'csManager', 'tutorManager']
    });

    Menu.addSubMenuItem('sidebar', 'tutor', {
      title: 'MENU_TUTOR_BOARD',
      state: 'tutor.tutor-board.list',
      roles: ['creator', 'admin', 'csManager', 'tutorManager']
    });

    /**
     * Schedule menus
     */
    Menu.addMenuItem('sidebar', {
      title: 'MENU_SCHEDULE',
      state: 'schedule',
      iconClass: 'fa-calendar-check',
      roles: ['creator', 'admin', 'csManager', 'tutorManager'],
      type: 'dropdown',
      position: 30
    });

    Menu.addSubMenuItem('sidebar', 'schedule', {
      title: 'MENU_SCHEDULE_CALENDAR',
      state: 'schedule.calendar',
      roles: ['creator', 'admin', 'csManager', 'tutorManager']
    });

    Menu.addSubMenuItem('sidebar', 'schedule', {
      title: 'MENU_SCHEDULE_DAILY',
      state: 'schedule.daily',
      roles: ['creator', 'tutor']
    });

    Menu.addSubMenuItem('sidebar', 'schedule', {
      title: 'MENU_SCHEDULE_COURSE',
      state: 'schedule.course.list',
      roles: ['creator', 'admin', 'csManager', 'tutorManager']
    });

    Menu.addSubMenuItem('sidebar', 'schedule', {
      title: 'MENU_SCHEDULE_LESSON',
      state: 'schedule.lesson.list',
      roles: ['creator', 'admin', 'csManager', 'tutorManager']
    });

    Menu.addSubMenuItem('sidebar', 'schedule', {
      title: 'MENU_SCHEDULE_LEVELTEST',
      state: 'schedule.leveltest.list',
      roles: ['creator', 'admin', 'csManager', 'tutorManager']
    });

    Menu.addSubMenuItem('sidebar', 'schedule', {
      title: 'MENU_SCHEDULE_MONTHLY',
      state: 'schedule.monthly.list',
      roles: ['creator', 'admin', 'csManager', 'tutorManager']
    });



    /**
     * Payment menus
     */
    Menu.addMenuItem('sidebar', {
      title: 'MENU_PAYMENT',
      state: 'payment.list',
      iconClass: 'fa-money-bill-alt',
      roles: ['creator', 'admin', 'csManager', 'tutorManager'],
      position: 40
    });


    /**
     * CS Center menus
     */
    Menu.addMenuItem('sidebar', {
      title: 'MENU_CS_CENTER',
      state: 'cs-center',
      iconClass: 'fa-headphones',
      type: 'dropdown',
      roles: ['creator', 'admin', 'csManager'],
      position: 50
    });

    Menu.addSubMenuItem('sidebar', 'cs-center', {
      title: 'MENU_CS_CENTER_CONTACT_US',
      state: 'cs-center.contact-us.list',
      roles: ['creator', 'admin', 'csManager']
    });

    Menu.addSubMenuItem('sidebar', 'cs-center', {
      title: 'MENU_CS_CENTER_COURSE_REVIEW',
      state: 'cs-center.course-review.list',
      roles: ['creator', 'admin', 'csManager']
    });

    Menu.addSubMenuItem('sidebar', 'cs-center', {
      title: 'MENU_CS_CENTER_NOTICE',
      state: 'cs-center.notice.list',
      roles: ['creator', 'admin', 'csManager']
    });

    Menu.addSubMenuItem('sidebar', 'cs-center', {
      title: 'MENU_CS_CENTER_FAQ',
      state: 'cs-center.faq.list',
      roles: ['creator', 'admin', 'csManager']
    });

    Menu.addSubMenuItem('sidebar', 'cs-center', {
      title: 'MENU_CS_CENTER_PARTNERSHIP',
      state: 'cs-center.partnership.list',
      roles: ['creator', 'admin', 'csManager']
    });

    Menu.addSubMenuItem('sidebar', 'cs-center', {
      title: 'MENU_CS_CENTER_CONTACT_1X1',
      state: 'cs-center.contact-1x1.list',
      roles: ['creator', 'admin', 'csManager']
    });

    /**
     * Resource menus
     */
    Menu.addMenuItem('sidebar', {
      title: 'MENU_RESOURCE',
      state: 'resource',
      iconClass: 'fa-shopping-cart',
      type: 'dropdown',
      roles: ['creator', 'admin', 'csManager'],
      position: 60
    });

    Menu.addSubMenuItem('sidebar', 'resource', {
      title: 'MENU_RESOURCE_PRODUCT',
      state: 'resource.product.list',
      roles: ['creator', 'admin', 'csManager']
    });

    Menu.addSubMenuItem('sidebar', 'resource', {
      title: 'MENU_RESOURCE_TEXTBOOK',
      state: 'resource.textbook.list',
      roles: ['creator', 'admin', 'csManager']
    });

    Menu.addSubMenuItem('sidebar', 'resource', {
      title: 'MENU_RESOURCE_COUPON',
      state: 'resource.coupon.list',
      roles: ['creator', 'admin', 'csManager']
    });

    Menu.addSubMenuItem('sidebar', 'resource', {
      title: 'MENU_RESOURCE_POINT',
      state: 'resource.point.list',
      roles: ['creator', 'admin', 'csManager']
    });

    // Menu.addSubMenuItem('sidebar', 'resource', {
    //   title: 'MENU_RESOURCE_HOLIDAY',
    //   state: 'resource.holiday.list',
    //   roles: ['creator', 'admin', 'csManager']
    // });

    // Menu.addSubMenuItem('sidebar', 'resource', {
    //   title: 'MENU_RESOURCE_PROVIDER',
    //   state: 'resource.provider.list',
    //   roles: ['creator', 'admin', 'csManager']
    // });

    Menu.addSubMenuItem('sidebar', 'resource', {
      title: 'MENU_RESOURCE_SUREM',
      state: 'resource.surem.list',
      roles: ['creator', 'admin', 'csManager']
    });

    Menu.addSubMenuItem('sidebar', 'resource', {
      title: 'MENU_RESOURCE_TALK_DREAM',
      state: 'resource.talk-dream.list',
      roles: ['creator', 'admin', 'csManager']
    });

    /**
     * Homepage menus
     */
    // Menu.addMenuItem('sidebar', {
    //   title: 'MENU_HOMEPAGE',
    //   state: 'homepage',
    //   iconClass: 'fa-sliders-h',
    //   type: 'dropdown',
    //   roles: ['creator', 'admin', 'csManager', 'tutorManager'],
    //   position: 70
    // });

    // Menu.addSubMenuItem('sidebar', 'homepage', {
    //   title: 'MENU_HOMEPAGE_EVENT_BANNER',
    //   state: 'homepage.event-banner.list',
    //   roles: ['creator', 'admin', 'csManager', 'tutorManager']
    // });

    // Menu.addSubMenuItem('sidebar', 'homepage', {
    //   title: 'MENU_HOMEPAGE_TUTOR_PROFILE',
    //   state: 'homepage.tutor-introduce.list',
    //   roles: ['creator', 'admin', 'csManager', 'tutorManager']
    // });

    /**
     * Salary menus
     */
    Menu.addMenuItem('sidebar', {
      title: 'MENU_TUTOR_BOARD',
      state: 'tutor.tutor-board.list',
      iconClass: 'fa-th-list',
      roles: ['creator', 'tutor'],
      position: 85
    });


    /**
     * Salary menus
     */
    Menu.addMenuItem('sidebar', {
      title: 'MENU_SALARY',
      state: 'salary',
      iconClass: 'fa-receipt',
      roles: ['creator', 'admin', 'csManager', 'tutorManager', 'tutor'],
      position: 90
    });

  }
}());

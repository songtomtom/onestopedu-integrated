(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('RegistGuestLeveltestController', RegistGuestLeveltestController);

  /**
   * Dependency Injection
   */
  RegistGuestLeveltestController.$inject = [
    '$scope',
    '$window',
    '$state',
    'leveltestResolve',
    'guestResolve',
    'Tutor',
    'Authentication',
    'TalkDream',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the regist leveltest controller
   */
  function RegistGuestLeveltestController(
    $scope,
    $window,
    $state,
    leveltest,
    guest,
    Tutor,
    Authentication,
    TalkDream,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.leveltest = leveltest;
    vm.application = {
      minutes: 10,
      productType: 'telephone',
      skill: 'novice'
    };

    // vm.member = member;
    vm.guest = guest;
    vm.regist = regist;
    vm.auth = Authentication;
    vm.datetimePickerOptions = angular.copy(dayPickerConfig);
    vm.tutors = Tutor.query();


    /**
     * On change start date
     */
    // $scope.$watch('vm.leveltest.started', (started) => {
    //   if (started && vm.application.minutes) {
    //
    //     Schedule.tutorPossibleByList({
    //         dates: [{
    //           started: moment(started).clone(),
    //           ended: moment(started).clone().add(vm.application.minutes, 'minutes')
    //         }]
    //       }).$promise
    //       .then((tutors) => {
    //         vm.tutors = tutors;
    //       })
    //       .catch(onError);
    //   }
    // });

    /**
     * Manual leveltests
     */
    function regist(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.leveltestForm');
        return false;
      }

      /**
       * Manual leveltests
       */
      if ($window.confirm('Are you sure you want to regist new leveltest?')) {
        vm.guest.providers = vm.leveltest.providers;
        vm.guest.$signup(onSignupGuestSuccess, onError);
      }
    }

    /**
     * Sign up guest success callback
     */
    function onSignupGuestSuccess(guest) {
      vm.application.desired = vm.leveltest.started.clone();
      vm.leveltest.user = guest._id;
      vm.leveltest.tutor = vm.tutor._id;
      vm.leveltest.providers = guest.providers;
      // vm.leveltest.started = vm.leveltest.started.clone();
      vm.leveltest.ended = vm.leveltest.started.clone()
        .add(vm.application.minutes, 'minutes');
      vm.leveltest.productType = vm.application.productType;
      vm.leveltest.application = vm.application;
      vm.leveltest.state = 'onStandby';

      vm.leveltest.$save(onSaveLeveltestSuccess, onError);
    }

    /**
     * Save Leveltest success callback
     */
    function onSaveLeveltestSuccess(leveltest) {
      TalkDream.sendMessageToApplyLeveltest(
          leveltest.productType,
          leveltest.user,
          leveltest._id
        )
        .then(onSendMessageSuccess)
        .catch(onError);

      /**
       * Send to apply to leveltest success callback
       */
      function onSendMessageSuccess() {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('guest.view.leveltest.list.detail', {
          guestId: leveltest.user,
          leveltestId: leveltest._id
        });
      }
    }

    /**
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }
  }

}());

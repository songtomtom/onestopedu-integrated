(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('RegistLeveltestByGuestController', RegistLeveltestByGuestController);

  /**
   * Dependency Injection
   */
  RegistLeveltestByGuestController.$inject = [
    '$scope',
    '$window',
    '$state',
    'leveltestResolve',
    'guestResolve',
    'Tutor',
    'TalkDream',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the leveltest guest regist controller
   */
  function RegistLeveltestByGuestController(
    $scope,
    $window,
    $state,
    leveltest,
    guest,
    Tutor,
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
    vm.guest = guest;
    vm.regist = regist;
    vm.datetimePickerOptions = angular.copy(dayPickerConfig);
    vm.tutors = Tutor.query();

    /**
     * Regist leveltests
     */
    function regist(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.leveltestForm');
        return false;
      }

      /**
       * Regist leveltests
       */
      if ($window.confirm('Are you sure you want to regist new leveltest?')) {

        vm.application.desired = vm.leveltest.started.clone();

        vm.leveltest.user = vm.guest._id;
        vm.leveltest.tutor = vm.tutor._id;
        vm.leveltest.providers = vm.guest.providers;
        vm.leveltest.ended = vm.leveltest.started.clone()
          .add(vm.application.minutes, 'minutes');
        vm.leveltest.productType = vm.application.productType;
        vm.leveltest.application = vm.application;
        vm.leveltest.state = 'onStandby';

        vm.leveltest.$save(onSaveLeveltestSuccess, onError);
      }
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

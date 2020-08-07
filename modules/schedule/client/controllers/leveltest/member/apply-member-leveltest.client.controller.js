(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('ApplyMemberLeveltestController', ApplyMemberLeveltestController);

  /**
   * Dependency Injection
   */
  ApplyMemberLeveltestController.$inject = [
    '$scope',
    '$window',
    '$state',
    'leveltestResolve',
    'Member',
    'Authentication',
    'TalkDream',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the apply leveltest controller
   */
  function ApplyMemberLeveltestController(
    $scope,
    $window,
    $state,
    leveltest,
    Member,
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

    vm.apply = apply;
    vm.auth = Authentication;
    vm.figureOutMember = figureOutMember;
    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    /**
     * Figure out Member to display
     */
    function figureOutMember() {
      Member.findByProviders(vm.leveltest.providers)
        .then((members) => {
          vm.members = members;
        })
        .catch(onError);
    }

    /**
     * Regist leveltests
     */
    function apply(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.leveltestForm');
        return false;
      }

      /**
       * Regist leveltests
       */
      if ($window.confirm('Are you sure you want to apply new leveltest?')) {
        vm.leveltest.user = vm.member._id;
        vm.leveltest.application = vm.application;
        vm.leveltest.$save(onSaveLeveltestSuccess, onError);
      }
    }

    /**
     * Save Leveltest success callback
     */
    function onSaveLeveltestSuccess(leveltest) {
      TalkDream.sendMessageToApplyLeveltest(
          leveltest.application.productType,
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
        $state.go('member.view.leveltest.list.detail', {
          memberId: leveltest.user,
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

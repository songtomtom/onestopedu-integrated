(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('SignupMemberController', SignupMemberController);

  /**
   * Dependency Injection
   */
  SignupMemberController.$inject = [
    '$scope',
    '$window',
    '$state',
    'memberResolve',
    'Authentication',
    'TalkDream',
    'toastr'
  ];

  /**
   * Configuring the Member signup controller
   */
  function SignupMemberController(
    $scope,
    $window,
    $state,
    member,
    Authentication,
    TalkDream,
    toastr
  ) {

    const vm = this;

    vm.member = member;
    vm.auth = Authentication;
    vm.signup = signup;

    if (angular.isDefined(vm.member)) {
      vm.member.memberType = 'normal';
      vm.member.age = 'student';
    }

    /**
     * Member Sign up
     */
    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.memberForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to sign up this member?')) {
        vm.member.password = '1234';
        vm.member.$signup()
          .then(onSingupMemberSuccess)
          .catch(onSingupMemberError);
      }

      /**
       * Sign up member success callback
       */
      function onSingupMemberSuccess(member) {
        TalkDream.sendMessageToSignup(member._id)
          .then(onSendTalkDreamSuccess)
          .catch(onSendTalkDreamError);
        // .then((response) => {

        // Notification.success({
        //     from: vm.auth.user._id,
        //     permissionRoles: ['tutor-manager', 'cs-manager', 'admin', 'creator'],
        //     stateName: 'member.modify',
        //     params: {
        //       memberId: member._id
        //     },
        //     message: `Member <strong>"${member.username}"</strong> is sign up completed on Integrated Administrator Page`
        //   })
        //   .then(onState)
        //   .catch(onError);
        // })
        // .catch(onError);
      }

      /**
       * Sign up member error callback
       */
      function onSingupMemberError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /**
       * Talk-Dream send message success callback
       */
      function onSendTalkDreamSuccess() {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.go('member.list');
      }

      /**
       * Talk-Dream send message error callback
       */
      function onSendTalkDreamError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }


  }

}());

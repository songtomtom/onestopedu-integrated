(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .controller('FooterController', FooterController);

  /**
   * Dependency Injection
   */
  FooterController.$inject = [
    '$scope',
    '$state',
    'Authentication',
    'Member',
    'Surem',
    'toastr'
  ];

  /**
   * Configuring the footer controller
   */
  function FooterController(
    $scope,
    $state,
    Authentication,
    Member,
    Surem,
    toastr
  ) {

    const vm = this;

    vm.members = Member.query();
    vm.auth = Authentication;
    // vm.open = true;
    vm.send = send;
    vm.openMobile = openMobile;
    vm.closeMobile = closeMobile;
    vm.sendType = 'select';

    /**
     * Watch text and check current byte
     */
    $scope.$watch('vm.text', (text) => {
      vm.byte = getByte(text);
    });

    $scope.$watch('vm.sendType', (sendType) => {
      if (vm.member) {
        vm.memberId = undefined;
      }
    });

    $scope.$watch('vm.memberId', (memberId) => {
      if (memberId) {
        Member.findOne(memberId)
          .then((foundMember) => {
            vm.member = foundMember;
          })
          .catch(onError);
      }
    });


    function openMobile() {
      vm.open = true;
    }

    function closeMobile() {
      vm.open = false;
    }

    /**
     * Get byte
     */
    function getByte(text) {
      let textByte = 0;
      if (!text) {
        return 0;
      }

      for (let i = 0; i < text.length; i += 1) {
        const charString = escape(text.charAt(i));
        if (charString.length === 1) {
          textByte += 1;
        } else if (charString.indexOf('%u') !== -1) {
          textByte += 2;
        } else {
          textByte += 1;
        }
      }
      return textByte;
    }

    /**
     * Send mobile message
     */
    function send(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.suremForm');
        return false;
      }

      const surem = {
        from: vm.auth.user._id,
        to: (vm.member && vm.sendType === 'select') ?
          vm.member._id : undefined,
        providers: (vm.member && vm.sendType === 'select') ?
          vm.member.providers : undefined,
        mobile: (vm.member && vm.sendType === 'select') ?
          vm.member.mobile : vm.inputMobile,
        byte: vm.byte,
        text: vm.text,
        sendType: vm.sendType
      };

      if (surem.sendType === 'input') {
        delete surem.to;
        delete surem.providers;
      }

      if (surem.byte <= 80) {
        surem.suremType = 'SMS';
      } else if (surem.byte > 80 && surem.byte < 2000) {
        surem.suremType = 'LMS';
      } else {
        toastr.error('The character byte can not exceed 80 or more than 2000.', 'Error', {
          timeOut: 0
        });
        return false;
      }


      Surem.send(surem)
        .then(onSendSuccess)
        .catch(onError);
    }

    /**
     * On message send success callback
     */
    function onSendSuccess(surem) {
      toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
      vm.memberId = undefined;
      vm.text = undefined;
      $state.reload();
    }

    /**
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }

    $scope.$on('open-small-mobile', (e, memberId) => {
      if (!angular.isUndefined(memberId)) {
        $scope.$apply(() => {
          vm.openMobile();
          vm.memberId = memberId;
        });
      }
    });
  }
}());

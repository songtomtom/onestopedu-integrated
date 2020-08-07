(function() {

  angular
    .module('resource')
    .controller('DetailPaymentController', DetailPaymentController);

  DetailPaymentController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    'memberResolve',
    'paymentResolve',
    'refundResolve',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the payment detail controller
   */
  function DetailPaymentController(
    $scope,
    $window,
    $state,
    $q,
    member,
    payment,
    refund,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;

    vm.member = member;
    vm.payment = payment;
    vm.refund = refund;

    vm.modifyPayment = modifyPayment;
    vm.submitRefund = submitRefund;
    vm.cancelRefund = cancelRefund;
    vm.calTotalPrice = calTotalPrice;
    vm.changePaymentSubPrice = changePaymentSubPrice;
    vm.changeRefundSubPrice = changeRefundSubPrice;
    vm.resetPrice = resetPrice;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      initDesiredDatetimePicker();
      initPaymentedDatetimePicker();
    }

    /**
     * [initDesiredDatetimePicker description]
     * @return {[type]} [description]
     */
    function initDesiredDatetimePicker() {
      vm.desiredDatetimePickerOptions = angular.copy(vm.datetimePickerOptions);
      vm.desiredDatetimePickerOptions.defaultDate = moment(vm.payment.desired);
    }

    /**
     * [initPaymentedDatetimePicker description]
     * @return {[type]} [description]
     */
    function initPaymentedDatetimePicker() {
      vm.paymentedDatetimePickerOptions = angular.copy(vm.datetimePickerOptions);
      vm.paymentedDatetimePickerOptions.defaultDate = moment(vm.payment.paymented);
    }

    /**
     * [state description]
     * @type {[type]}
     */
    $scope.$watch('vm.payment.state', (state) => {
      if (state && state === 'refunded' && !vm.refund._id) {
        vm.refund.ccPrice = vm.payment.ccPrice;
        vm.refund.dwbPrice = vm.payment.dwbPrice;
        vm.refund.atPrice = vm.payment.atPrice;
        vm.refund.arsPrice = vm.payment.arsPrice;
        vm.refund.payupPrice = vm.payment.payupPrice;
        vm.refund.totalPrice = sumPaymentPrice();
      }
    });

    /**
     * Sum payment value for each payment method.
     */
    function sumPaymentPrice() {
      return vm.payment.dwbPrice +
        vm.payment.ccPrice +
        vm.payment.atPrice +
        vm.payment.arsPrice +
        vm.payment.payupPrice;
    }

    /**
     * Sum payment value for each payment method.
     */
    function sumRefundPrice() {
      return vm.refund.dwbPrice +
        vm.refund.ccPrice +
        vm.refund.atPrice +
        vm.refund.arsPrice +
        vm.refund.payupPrice;
    }

    /**
     * Find provider by list success callback
     */
    function changePaymentSubPrice() {
      vm.payment.totalPrice = sumPaymentPrice();
    }

    /**
     * Find provider by list success callback
     */
    function changeRefundSubPrice() {
      vm.refund.totalPrice = sumRefundPrice();
    }

    /**
     * Set all prices are 0
     */
    function resetPrice() {
      vm.payment.dwbPrice = 0;
      vm.payment.ccPrice = 0;
      vm.payment.atPrice = 0;
      vm.payment.arsPrice = 0;
      vm.payment.payupPrice = 0;
    }

    /**
     * Modify payment information
     */
    function modifyPayment(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.paymentForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to modify this payment?')) {
        vm.payment.$update()
          .then(onUpdatePaymentSuccess)
          .catch(onUpdatePaymentError);
      }

      // Update coupon success callback
      function onUpdatePaymentSuccess(payment) {
        toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
        $state.reload();
      }
      // Update coupon error callback
      function onUpdatePaymentError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * Calculation total price promise
     */
    function calTotalPrice() {
      const point = vm.point || 0;
      const coupon = angular.copy(vm.coupon);

      calPrice()
        .then(calPoint)
        .then(calCoupon)
        .then((totalPrice) => {
          vm.payment.totalPrice = totalPrice;
        })
        .catch((err) => {
          toastr.error(err.data.message, 'Error', {
            timeOut: 0
          });
        });

      /**
       * Calculation sub pirce
       */
      function calPrice() {
        return $q((resolve, reject) => {
          const totalPrice = sumPaymentPrice();
          return resolve(totalPrice);
        });
      }

      /**
       * Calculation discount point amount
       */
      function calPoint(totalPrice) {
        return $q((resolve, reject) => {
          if (point && point > 0) {
            totalPrice -= point;
          }
          return resolve(totalPrice);
        });
      }

      /**
       * Calculation coupon price
       */
      function calCoupon(totalPrice) {
        return $q((resolve, reject) => {
          if (coupon && coupon._id) {
            if (coupon.discountType === 'rate') {
              totalPrice *= 1 - (coupon.amount * 0.01);
            } else {
              // price
              totalPrice -= coupon.amount;
            }
          }
          return resolve(totalPrice);
        });
      }
    }


    /**
     * Remove refunded
     */
    function cancelRefund() {

      if ($window.confirm('Are you sure you want to refund cancel this payment?')) {
        vm.refund.$remove()
          .then((refund) => {
            vm.payment.state = 'completed';
            vm.payment.$update((payment) => {
              $window.location.reload();
            }, onError);
          })
          .catch(onError);
      }
    }

    /**
     * Refund
     * @param  {Boolean} isValid Validate for refund form
     */
    function submitRefund(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.refundForm');
        return false;
      }

      if (vm.refund.totalPrice > vm.payment.totalPrice) {
        $window.alert('The refund price cannot be greater than the payment price.');
        return false;
      }

      if ($window.confirm('Are you sure you want to refund this payment?')) {
        if (!vm.refund._id) {
          vm.refund.user = vm.payment.user._id;
          vm.refund.payment = vm.payment._id;
          vm.refund.providers = vm.payment.providers;
          vm.refund.requested = moment();
          vm.refund.$save(onRefundSaveSuccess, onError);
        } else {
          vm.refund.$update(onReload, onError);
        }
      }
    }

    /**
     * Save Refund success callback
     */
    function onRefundSaveSuccess(refund) {

      vm.payment.state = 'refunded';
      vm.payment.refund = refund._id;
      vm.payment.$update(onReload, onError);
    }

    /**
     * Reload callback
     */
    function onReload() {
      toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
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
  }
}());

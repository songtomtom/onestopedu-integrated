(function() {

  angular
    .module('user')
    .controller('VirtualPaymentByMemberController', VirtualPaymentByMemberController);

  VirtualPaymentByMemberController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$filter',
    '$q',
    'paymentResolve',
    'memberResolve',
    'Product',
    'Point',
    'Coupon',
    'Authentication',
    'dayPickerConfig',
    'toastr'
  ];

  /**
   * Configuring the virtual payment by member controller
   */
  function VirtualPaymentByMemberController(
    $scope,
    $window,
    $state,
    $filter,
    $q,
    payment,
    member,
    Product,
    Point,
    Coupon,
    Authentication,
    dayPickerConfig,
    toastr
  ) {

    const vm = this;
    vm.auth = Authentication;
    vm.payment = payment;
    vm.member = member;
    vm.point = 0;

    vm.search = {};

    vm.figureOutProduct = figureOutProduct;
    vm.calTotalPrice = calTotalPrice;
    vm.virtualPayment = virtualPayment;
    vm.changeProduct = changeProduct;
    vm.changePaymentMethod = changePaymentMethod;
    vm.datetimePickerOptions = angular.copy(dayPickerConfig);

    initialize();

    /**
     * Initialize
     */
    function initialize() {
      // Reset price for method of all, Coupon and Point reset too
      initCal();
      // Find product list
      findProductList();
    }

    /**
     * Reset price for method of all
     * Coupon and Point reset too
     */
    function initCal() {
      resetPrice();
      resetCoupon();
      resetPoint();
    }

    /**
     * Reset all prices
     */
    function resetPrice() {
      vm.payment.arsPrice = 0;
      vm.payment.atPrice = 0;
      vm.payment.ccPrice = 0;
      vm.payment.dwbPrice = 0;
      vm.payment.payupPrice = 0;
    }

    /**
     * Reset coupon
     */
    function resetCoupon() {
      vm.coupon = undefined;
    }

    /**
     * Reset point
     */
    function resetPoint() {
      vm.point = 0;
    }

    /**
     * Sum payment value for each payment method.
     */
    function sumPrice() {
      return vm.payment.dwbPrice +
        vm.payment.ccPrice +
        vm.payment.atPrice +
        vm.payment.arsPrice +
        vm.payment.payupPrice;
    }

    /**
     * Product list
     */
    function findProductList() {
      Product.find()
        .then(onFindProductSuccess)
        .catch(onFindProductError);
      // Find product success callback
      function onFindProductSuccess(products) {
        vm.products = products;
      }
      // Find product error callback
      function onFindProductError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }
    }

    /**
     * On change product select bar event
     */
    function changeProduct(product) {
      if (product) {
        initCal();
        vm.payment.subLessonCount = product.lessonCount;
        vm.payment.subPostponeCount = product.postponeCount;
        vm.payment.totalPrice = product.subPrice;
      }
    }

    /**
     * On change payment method radio button event
     */
    function changePaymentMethod(method) {
      if (method && angular.isString(method)) {
        initCal();
        vm.payment.totalPrice = vm.product.subPrice;
        vm.payment[method.toLowerCase() + 'Price'] = vm.product.subPrice;
      }
    }

    /**
     * Figure out product to display
     */
    function figureOutProduct() {
      vm.filteredItems = $filter('filter')(vm.products, vm.search);
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
          const totalPrice = sumPrice();
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
     * Create new virtual payment information
     */
    function virtualPayment(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.paymentForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to create this payment?')) {

        vm.payment.providers = vm.member.providers;
        vm.payment.user = vm.member._id;
        vm.payment.product = vm.product._id;
        vm.payment.paymentedProduct = vm.product;

        vm.payment.$save()
          .then(onSavePaymentSuccess)
          .catch(onSavePaymentError);
      }

      /**
       * Save payment success callback
       */
      function onSavePaymentSuccess(payment) {
        const point = vm.point || 0;
        const coupon = angular.copy(vm.coupon);

        // If you use a points for payment,
        // save the coupon information.
        // The next step if not in use points.
        savePoint(payment, point)
          // If you use a coupon for payment,
          // modify the coupon information.
          // The next step if not in use coupon.
          .then((payment) => {
            return updateCoupon(payment, coupon);
          })
          // If a coupon or points is used, modify the payment information.
          .then(updatePayment)
          .then((payment) => {
            toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
            $state.go('member.view.payment.list.detail', {
              paymentId: payment._id
            });
          })
          .catch((err) => {
            toastr.error(err.data.message, 'Error', {
              timeOut: 0
            });
          });
      }

      /**
       * Save payment error callback
       */
      function onSavePaymentError(err) {
        toastr.error(err.data.message, 'Error', {
          timeOut: 0
        });
      }

      /**
       * Save point promise
       */
      function savePoint(payment, point) {
        const deferred = $q.defer();
        if (point && point > 0) {
          const doc = {
            amount: (0 - point),
            isLock: true,
            providers: payment.providers,
            title: 'Payment to "' + payment.paymentedProduct.title + '"',
            user: payment.user._id || payment.user
          };

          Point.savePoint(doc)
            .then(onSavePointSuccess)
            .catch(onSavePointError);
        } else {
          deferred.resolve(payment);
        }

        return deferred.promise;
        // Save point success callback
        function onSavePointSuccess(point) {
          payment.usePoint = point._id;
          deferred.resolve(payment);
        }
        // Save point success callback
        function onSavePointError(err) {
          deferred.resolve(err);
        }
      }

      /**
       * Save point promise
       */
      function updateCoupon(payment, coupon) {
        const deferred = $q.defer();

        if (coupon && coupon._id) {
          Coupon.findOne(coupon._id)
            .then(onFindCouponSuccess)
            .catch(onFindCouponError);
        } else {
          deferred.resolve(payment);
        }

        return deferred.promise;
        // Find coupon success callback
        function onFindCouponSuccess(coupon) {
          coupon.state = 'used';
          coupon.used = moment();
          coupon.$update()
            .then(onUpdateCouponSuccess)
            .catch(onUpdateCouponError);
        }

        // Find coupon error callback
        function onFindCouponError(err) {
          deferred.resolve(err);
        }
        // Update coupon success callback
        function onUpdateCouponSuccess(coupon) {
          payment.useCoupon = coupon._id;
          deferred.resolve(payment);
        }
        // Update coupon error callback
        function onUpdateCouponError(err) {
          deferred.resolve(err);
        }
      }

      /**
       * Update payment promise
       */
      function updatePayment(payment) {
        const deferred = $q.defer();
        if (payment.usePoint || payment.useCoupon) {
          payment.$update()
            .then(onUpdatePaymentSuccess)
            .catch(onUpdatePaymentError);
        } else {
          deferred.resolve(payment);
        }
        return deferred.promise;
        // Update coupon success callback
        function onUpdatePaymentSuccess(payment) {
          deferred.resolve(payment);
        }
        // Update coupon error callback
        function onUpdatePaymentError(err) {
          deferred.resolve(err);
        }
      }
    }
  }
}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('schedule')
    .controller('RegistCourseController', RegistCourseController);

  /**
   * Dependency Injection
   */
  RegistCourseController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$q',
    'paymentResolve',
    'Tutor',
    'Course',
    'Lesson',
    'Monthly',
    'dayPickerConfig',
    'daysOfWeekConfig',
    'toastr'
  ];

  /**
   * Configuring the course regist controller
   */
  function RegistCourseController(
    $scope,
    $window,
    $state,
    $q,
    payment,
    Tutor,
    Course,
    Lesson,
    Monthly,
    dayPickerConfig,
    daysOfWeekConfig,
    toastr
  ) {

    const vm = this;

    vm.payment = payment;
    vm.tutors = Tutor.query();

    vm.checkings = [];

    vm.regist = regist;
    vm.goBack = goBack;

    vm.autoCheckings = autoCheckings;
    vm.resetCheckings = resetCheckings;

    vm.datetimePickerOptions = angular.copy(dayPickerConfig);
    vm.daysOfWeek = daysOfWeekConfig;

    initialize();

    /** On change to days of week checkbox list callback */
    $scope.$watch('vm.checkings', changeCheckings, true);
    /** On change to start date datetimepicker callback */
    $scope.$watch('vm.started', changeStarted);
    /** On change to lesson count input callback */
    $scope.$watch('vm.maxTotalLessonCount', changeTotalLessonCount);

    /**
     * Initialize
     */
    function initialize() {
      validateAccess();
      autoCheckings();
      initTotalLessonCount();
      initTotalPostponeCount();
    }

    /**
     * On change to days of week checkbox list callback
     */
    function changeCheckings(checkings) {
      if (checkings && checkings.length > 0) {
        /** Validate to days of week checklist for "equal", "required" */
        validateForm();
        /** Generate seed lesson schedule days */
        seedDays();
      }
    }

    /**
     * On change to start date datetimepicker callback
     */
    function changeStarted() {
      seedDays();
    }

    /**
     * On change to lesson count input callback
     */
    function changeTotalLessonCount() {
      seedDays();
    }

    /**
     * Auto select day of weeks
     */
    function autoCheckings() {
      resetCheckings();
      initCheckings();
    }

    /**
     * Initialize current checking days of week checkboxes
     * If product times is 2, Thesday, Thursday selected
     * If product times is 3, Monday, Wednesday, Friday selected
     * If product times is 5, All days of week selected
     */
    function initCheckings() {
      if (vm.payment.paymentedProduct.times === 2) {
        /** Thesday, Thursday */
        vm.checkings = [2, 4];
      } else if (vm.payment.paymentedProduct.times === 3) {
        /** Monday, Wednesday, Friday */
        vm.checkings = [1, 3, 5];
      } else {
        /** Monday, Thesday, Wednesday, Thursday, Friday */
        vm.checkings = [1, 2, 3, 4, 5];
      }
    }

    /**
     * Reset checkings array
     */
    function resetCheckings() {
      vm.checkings = [];
    }

    /**
     * Initialize total lesson count
     */
    function initTotalLessonCount() {
      vm.maxTotalLessonCount = vm.payment.subLessonCount;
    }

    /**
     * Initialize total postpone count
     */
    function initTotalPostponeCount() {
      vm.maxTotalPostponeCount = vm.payment.subPostponeCount;
    }

    /**
     * Validate to access
     */
    function validateAccess() {
      if (vm.payment.course) {
        toastr.error('You are not authorized to access this resource', 'Error', {
          timeOut: 0
        });
        $state.go($state.previous.state.name || 'payment.list', $state.previous.params);
      }
    }

    /**
     * Validate to days fo week and start datetime picker
     */
    function validateForm() {
      if (vm.form.courseForm.daysOfWeek) {
        /** Validate that at least one checkbox of the week is selected */
        vm.form.courseForm.daysOfWeek
          .$setValidity('required', vm.checkings.length > 0);
        /** Validate that the day of the week checkbox is selected by the number of products*/
        vm.form.courseForm.daysOfWeek
          .$setValidity('equal', vm.checkings.length === vm.payment.paymentedProduct.times);
      }
    }

    /**
     * Generate seed lesson schedule days
     */
    function seedDays() {

      if (vm.checkings.length !== vm.payment.paymentedProduct.times ||
        vm.maxTotalLessonCount < vm.payment.subLessonCount) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.courseForm');
        return false;
      }

      let i = 0;
      const days = [];

      while (days.length < vm.maxTotalLessonCount) {

        /** Next day */
        const increased = moment(vm.started).clone()
          .add(i, 'days');

        /** Check to include "checkings" days of week */
        if (vm.checkings.includes(increased.day())) {
          const day = {
            started: increased.clone(),
            ended: increased.clone()
              .add(vm.payment.paymentedProduct.minutes, 'minutes')
          };

          days.push(day);
        }
        i += 1;
      }

      /**
       * Promise
       */
      return handleDisabledDaysOfWeek(days)
        .then(handleEndedDateTimePicker)
        .then((days) => {
          return $q((resolve, reject) => {
            if (days && days.length > 0) {
              return resolve(days);
            }
          });
        })
        .catch((err) => {
          console.log(err);
          toastr.error(err || err.data.message, 'Error', {
            timeOut: 0
          });
        });

      /**
       * Set disabled to Days of week checkboxes
       */
      function handleDisabledDaysOfWeek(days) {
        return $q((resolve, reject) => {

          if (!days || days.length < 1) {
            return reject('Failure to generate lesson temporary days');
          }

          const daysOfWeekIndexes = [0, 1, 2, 3, 4, 5, 6];
          vm.datetimePickerOptions.daysOfWeekDisabled = daysOfWeekIndexes
            .filter((day) => {
              return !vm.checkings.includes(day);
            });

          return resolve(days);
        });
      }

      /**
       * Set the end of lesson date datetime picker
       */
      function handleEndedDateTimePicker(days) {
        return $q((resolve, reject) => {
          vm.ended = days[days.length - 1].started;
          return resolve(days);
        });
      }
    }

    /**
     * Regist Course
     */
    function regist(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.courseForm');
        return false;
      }

      if ($window.confirm('Are you sure you want to regist new lessons?')) {

        seedDays()
          .then(saveCourse)
          .then(createLessons)
          .then(createMonthlies)
          .then(updateCourse)
          .then(updatePayment)
          .then((payment) => {
            toastr.success(moment().format('YYYY/MM/DD HH:mm:ss'), 'Success');
            $state.go('member.view.course.list.detail', {
              courseId: payment.course._id || payment.course
            });
          })
          .catch((err) => {
            toastr.error(err.data.message || err, 'Error', {
              timeOut: 0
            });
          });
      }

      /**
       * Save or Create course
       */
      function saveCourse(days) {
        const deferred = $q.defer();

        const course = new Course({
          user: vm.payment.user._id,
          mainTutor: vm.tutor._id,
          payment: vm.payment._id,
          providers: vm.payment.providers,
          virtualProduct: {
            productType: vm.payment.paymentedProduct.productType,
            curriculum: vm.payment.paymentedProduct.curriculum,
            nation: vm.payment.paymentedProduct.nation,
            month: vm.payment.paymentedProduct.month,
            times: vm.payment.paymentedProduct.times,
            minutes: vm.payment.paymentedProduct.minutes
          },
          maxCounting: {
            lesson: vm.maxTotalLessonCount,
            postpone: vm.maxTotalPostponeCount
          },
          daysOfWeek: vm.daysOfWeek.map((day) => {
            return {
              index: day.index,
              name: day.name,
              selected: vm.checkings.includes(day.index)
            };
          })
        });

        course.$save()
          .then(onSaveCourseSuccess)
          .catch(onSaveCourseError);

        return deferred.promise;

        /** Save course success callback */
        function onSaveCourseSuccess(course) {

          const values = {
            course,
            days
          };

          deferred.resolve(values);
        }

        /** Save course error callback */
        function onSaveCourseError(err) {
          deferred.reject(err);
        }
      }

      /**
       * Save or Create course
       */
      function createLessons(values) {
        const deferred = $q.defer();
        const days = values.days;
        const course = values.course;

        const documents = days.map((day, index) => {

          return new Lesson({
            user: course.user,
            tutor: course.mainTutor,
            course: course._id,
            providers: course.providers,
            productType: course.virtualProduct.productType,
            minutes: course.payment.paymentedProduct.minutes,
            started: moment(day.started).clone(),
            ended: moment(day.ended).clone()
          });
        });

        Lesson.createLessons(documents)
          .then(onCreateLessonsSuccess)
          .catch(onCreateLessonsError);

        return deferred.promise;

        /** Create lessons success callback */
        function onCreateLessonsSuccess(lessons) {
          values.course.startLesson = lessons[0]._id;
          values.course.endLesson = lessons[lessons.length - 1]._id;
          deferred.resolve(values);
        }

        /** Create lessons error callback */
        function onCreateLessonsError(err) {
          deferred.reject(err);
        }
      }

      /**
       * Save or Create course
       */
      function createMonthlies(values) {
        const deferred = $q.defer();

        const course = values.course;
        const days = values.days;
        const divDays = [];

        const byMonth = Math.floor(days.length / course.payment.paymentedProduct.month);
        const count = Math.floor(days.length / byMonth);

        for (let i = 0; i < count; i += 1) {
          let _byMonth = byMonth;
          if ((days.length % byMonth) > 0) {
            _byMonth += 1;
          }
          divDays.push(days.splice(0, _byMonth));
        }

        if (divDays && divDays.length > 0) {
          const documents = divDays.map((days) => {

            const cloned = moment(days[days.length - 1].started);

            return new Monthly({
              user: course.user,
              tutors: [course.mainTutor],
              providers: course.providers,
              course: course._id,
              started: cloned.clone()
                .add(-1, 'weeks')
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0),
              ended: cloned.clone()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
            });
          });

          Monthly.createMonthlies(documents)
            .then(onCreateMonthliesSuccess)
            .catch(onCreateMonthliesError);

        } else {
          deferred.reject({
            message: 'Generate to lesson days divine by month error'
          });
        }


        return deferred.promise;

        /** Create monthly success callback */
        function onCreateMonthliesSuccess(monthlies) {
          deferred.resolve(course);
        }

        /** Create monthly error callback */
        function onCreateMonthliesError(err) {
          deferred.reject(err);
        }
      }

      /**
       * Update start and end lesson,
       * Created lessons and monthly evaluations for course
       */
      function updateCourse(course) {
        const deferred = $q.defer();

        course.$update()
          .then(onUpdateCourseSuccess)
          .catch(onUpdateCourseError);

        return deferred.promise;

        /** Update course success callback */
        function onUpdateCourseSuccess(course) {
          deferred.resolve(course);
        }

        /** Update course success callback */
        function onUpdateCourseError(err) {
          deferred.reject(err);
        }
      }

      /**
       * Update course object id to payment schema
       * change payment state to "completed"
       */
      function updatePayment(course) {
        const deferred = $q.defer();

        vm.payment.course = course._id;
        vm.payment.state = 'completed';
        vm.payment.$update()
          .then(onUpdatePaymentSuccess)
          .catch(onUpdatePaymentError);

        return deferred.promise;

        /** Update payment success callback */
        function onUpdatePaymentSuccess(payment) {
          deferred.resolve(payment);
        }

        /** Update payment success callback */
        function onUpdatePaymentError(err) {
          deferred.reject(err);
        }
      }
    }

    /**
     * Go to the previous page.
     * If no previous page exists, go to the Payment List page
     */
    function goBack() {
      $state.go($state.previous.state.name || 'payment.list', $state.previous.params);
    }
  }

}());

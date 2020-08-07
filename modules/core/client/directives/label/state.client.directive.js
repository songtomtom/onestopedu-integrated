(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('state', state);

  /**
   * Dependency Injection
   */
  state.$inject = ['$timeout', '$interpolate'];

  /**
   * Directive for label state
   */
  function state($timeout, $interpolate) {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    /**
     * Directive link
     */
    function link(scope, elem) {
      const state = $interpolate(elem.text())(scope);
      let labelClass;

      if (state === 'active') {
        labelClass = 'label label-success';
      } else if (state === 'checked' || state === 'onStandby' || state === 'unScheduled' || state === 'notApplicable' || state === 'valid' || state === 'inProgress') {
        labelClass = 'label label-default';
      } else if (state === 'attendance' || state === 'scheduled' || state === 'completed' || state === 'used' || state === 'reRegisted') {
        labelClass = 'label label-secondary';
      } else if (state === 'withdrawal' || state === 'refunded' || state === 'absence' || state === 'canceled' || state === 'tutorCanceled' || state === 'technicalProblem' || state === 'inValid' || state === 'unHold') {
        labelClass = 'label label-danger';
      } else if (state === 'inActive' || state === 'applied' || state === 'pending' || state === 'hold') {
        labelClass = 'label label-yellow';
      } else if (state === 'unPaid') {
        labelClass = 'label label-warning';
      } else if (state === 'postpone') {
        labelClass = 'label label-purple';
      }

      // Capitalize
      elem.addClass(labelClass);
      elem.text(state.charAt(0).toUpperCase() + state.slice(1));
    }
  }
}());

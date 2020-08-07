(function() {

  /** Module Configuration   */
  angular
    .module('core')
    .constant('daysOfWeekConfig', [{
      name: 'mon',
      index: 1,
      selected: false
    }, {
      name: 'tue',
      index: 2,
      selected: false
    }, {
      name: 'wed',
      index: 3,
      selected: false
    }, {
      name: 'thu',
      index: 4,
      selected: false
    }, {
      name: 'fri',
      index: 5,
      selected: false
    }]);
}());

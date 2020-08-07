(function() {

  /** Module Configuration */
  angular
    .module('core')
    .constant('monthPickerConfig', {
      daysOfWeekDisabled: [0, 6],
      format: 'YYYY/MM/DD HH:mm',
      keepOpen: false,
      stepping: 5,
      collapse: false
    });
}());

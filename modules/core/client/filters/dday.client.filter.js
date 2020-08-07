(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .filter('dday', dday);

  /**
   * Convert D-Day
   */
  function dday() {
    return (input) => {
      return moment(input).diff(moment(), 'days');
    };
  }

}());

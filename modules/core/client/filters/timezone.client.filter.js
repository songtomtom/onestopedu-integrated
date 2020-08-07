(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .filter('timezone', timezone);

  /**
   * Convert timezone
   */
  function timezone() {
    return (input, timezone, format) => {
      return moment(input).tz(timezone).format(format);
    };
  }

}());

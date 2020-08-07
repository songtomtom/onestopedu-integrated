(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .filter('capitalize', capitalize);

  /**
   * First letter Uppercase
   */
  function capitalize() {
    return (input) => {
      // return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
      return (!!input) ? input.charAt(0).toUpperCase() + input.slice(1) : '';
    };
  }

}());

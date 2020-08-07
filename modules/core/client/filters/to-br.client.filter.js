(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .filter('toBr', toBr);

  /**
   * First letter Uppercase
   */
  function toBr() {
    return (input) => {
      return (!!input) ? input.replace(/(?:\r\n|\r|\n)/g, '<br />') : '';
    };
  }

}());

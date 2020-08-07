(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .filter('range', range);

  function range() {
    return (input, total) => {
      total = parseInt(total, 10);
      for (let i = 0; i < total; i += 1) {
        input.push(i);
      }
      return input;
    };
  }
}());

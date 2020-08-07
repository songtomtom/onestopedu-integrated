(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .filter('cutContents', cutContents);

  /**
   * Cutting string
   */
  function cutContents() {
    return (input, max) => {
      if (!input) return '';

      max = parseInt(max, 10);
      if (!max) {
        return input;
      }

      if (input.length <= max) {
        return input;
      }

      input = input.substr(0, max);
      let lastspace = input.lastIndexOf(' ');
      if (lastspace !== -1) {
        if (input.charAt(lastspace - 1) === '.' || input.charAt(lastspace - 1) === ',') {
          lastspace -= 1;
        }
        input = input.substr(0, lastspace);
      }
      return `${input} ...`;
    };
  }

}());

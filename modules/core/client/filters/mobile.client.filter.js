(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .filter('mobile', mobile);

  /**
   * Mobile device number format filter
   */
  function mobile() {
    return (input) => {
      if (!input) {
        return '';
      }

      const value = input.toString().trim().replace(/^\+/, '');

      if (value.match(/[^0-9]/)) {
        return input;
      }

      let country;
      let city;
      let number;

      switch (value.length) {
        case 1:
        case 2:
        case 3:
          city = value;
          break;

        default:
          city = value.slice(0, 3);
          number = value.slice(3);
      }

      if (number) {
        if (number.length > 3) {
          number = `${number.slice(0, 4)}-${number.slice(4, 8)}`;
        }

        return (`${city}-${number}`).trim();
      }
    };
  }

}());

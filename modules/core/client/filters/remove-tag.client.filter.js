(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .filter('removeTag', removeTag);

  /**
   * Remove HTML tags
   */
  function removeTag() {
    return (input) => {
      return input ? String(input).replace(/<[^>]+>/gm, '') : '';
    };
  }

}());

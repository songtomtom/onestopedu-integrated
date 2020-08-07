(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .controller('TranslateController', TranslateController);

  /**
   * Dependency Injection
   */
  TranslateController.$inject = ['$translate'];

  /**
   * TranslateController - Controller for translate
   */
  function TranslateController($translate) {

    const vm = this;

    vm.changeLanguage = changeLanguage;

    function changeLanguage(langKey) {
      $translate.use(langKey);
      vm.language = langKey;
    }
  }

}());

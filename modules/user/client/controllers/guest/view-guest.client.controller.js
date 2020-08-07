(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ViewGuestController', ViewGuestController);

  /**
   * Dependency Injection
   */
  ViewGuestController.$inject = ['guestResolve'];

  /**
   * Configuring the Guest View controller
   */
  function ViewGuestController(guest) {

    const vm = this;

    vm.guest = guest;
    vm.backgroundImageName = getBackgroundImageName();

    /**
     * Geneate random(1 ~ 17) number and Sign in background image name
     * @return {[String]} Background image name
     */
    function getBackgroundImageName() {
      return `/modules/user/client/img/profile-bg/profile-bg-${Math.floor(Math.random() * 8) + 1}.jpg`;
    }
  }

}());

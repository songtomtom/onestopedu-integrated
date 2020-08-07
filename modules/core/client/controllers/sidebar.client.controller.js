(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .controller('SidebarController', SidebarController);

  /**
   * Dependency Injection
   */
  SidebarController.$inject = ['$state', 'Authentication', 'Menu'];

  /**
   * Configuring the Side Navigation controller
   */
  function SidebarController($state, Authentication, Menu) {

    const vm = this;

    vm.$state = $state;
    vm.auth = Authentication;
    vm.menu = Menu.getMenu('sidebar');
  }
}());

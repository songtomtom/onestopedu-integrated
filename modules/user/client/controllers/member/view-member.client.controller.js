(function() {

  /**
   * Module Configuration
   */
  angular
    .module('user')
    .controller('ViewMemberController', ViewMemberController);

  /**
   * Dependency Injection
   */
  ViewMemberController.$inject = ['memberResolve', 'Lesson', 'toastr'];

  /**
   * Configuring the Member View controller
   */
  function ViewMemberController(member, Lesson, toastr) {

    const vm = this;

    vm.member = member;
    vm.backgroundImageName = getBackgroundImageName();

    Lesson.findOneByRecent(vm.member._id)
      .then((lesson) => {
        vm.lesson = lesson;
      })
      .catch(onError);

    /**
     * Geneate random(1 ~ 17) number and Sign in background image name
     * @return {[String]} Background image name
     */
    function getBackgroundImageName() {
      return `/modules/user/client/img/profile-bg/profile-bg-${Math.floor(Math.random() * 8) + 1}.jpg`;
    }

    /**
     * Error callback
     */
    function onError(err) {
      toastr.error(err.data.message, 'Error', {
        timeOut: 0
      });
    }
  }

}());

(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('ngThumb', ngThumb);

  /**
   * Dependency Injection
   */
  ngThumb.$inject = ['$window'];

  /**
   * Directive for ngThumb with custom height
   */
  function ngThumb($window) {
    const directive = {
      restrict: 'A',
      template: '<canvas/>',
      link
    };

    return directive;

    function link(scope, elem, attrs) {
      const helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile,
        isImage
      };

      if (!helper.support) {
        return;
      }

      const params = scope.$eval(attrs.ngThumb);

      if (!helper.isFile(params.file)) {
        return;
      }

      if (!helper.isImage(params.file)) {
        return;
      }

      const canvas = elem.find('canvas');
      const reader = new FileReader();

      reader.onload = onLoadFile;
      reader.readAsDataURL(params.file);

      function onLoadFile(event) {
        const img = new Image();
        img.onload = onLoadImage;
        img.src = event.target.result;
      }

      function onLoadImage() {
        const width = params.width || (this.width / this.height) * params.height;
        const height = params.height || (this.height / this.width) * params.width;
        canvas.attr({
          width,
          height
        });
        canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
      }

      function isFile(item) {
        return angular.isObject(item) && item instanceof $window.File;
      }

      function isImage(file) {
        const type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    }
  }
}());

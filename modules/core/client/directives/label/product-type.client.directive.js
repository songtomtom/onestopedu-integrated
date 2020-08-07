(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .directive('productType', productType);

  /**
   * Dependency Injection
   */
  productType.$inject = ['$interpolate'];

  /**
   * Directive for label Product Type
   */
  function productType($interpolate) {

    const directive = {
      restrict: 'A',
      link
    };

    return directive;

    /**
     * Directive link
     */
    function link(scope, element) {

      const productType = $interpolate(element.text())(scope);
      if (productType === 'telephone') {

        /**
         * Telephone
         *
         * background-color: #1ab394
         * color: #FFFFFF;
         */
        // element.addClass('label label-success');
        element.addClass('label label-default');
      } else if (productType === 'skype') {

        /**
         * Skype
         *
         * background-color: #00aae8
         * color: #FFFFFF
         */
        element.addClass('label label-skype');
      } else if (productType === 'kakaoTalk') {

        /**
         * KakaoTalk
         *
         * background-color: #fae100
         * color: #3b1e1e;
         */
        element.addClass('label label-kakaotalk');
      } else if (productType === 'screenBoard') {

        /**
         * ScreenBoard
         *
         * background-color: #FFFFFF
         * color: #5E5E5E;
         */
        element.addClass('label label-purple');
      }

      /**
       * Capitalize
       */
      element.text(productType.charAt(0).toUpperCase() + productType.slice(1));
      // element.text(productType.toUpperCase());

    }

  }

}());

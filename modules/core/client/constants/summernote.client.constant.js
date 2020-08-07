(function() {

  /**
   * Module Configuration
   */
  angular
    .module('core')
    .constant('summernoteConfig', {
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['fontsize', ['fontsize']],
        ['insert', ['picture', 'video']],
        ['para', ['ul', 'ol', 'paragraph']]
      ],
      height: 500,
      focus: false,
      airMode: false,
      placeholder: 'Please, enter text here!'
    });
}());

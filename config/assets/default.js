/**
 * Module Exports
 */
module.exports = {
  client: {
    lib: {
      css: [
        'public/bower_components/jquery-ui/themes/base/jquery-ui.min.css',
        'public/bower_components/animate.css/animate.min.css',
        'public/bower_components/bootstrap/dist/css/bootstrap.min.css',
        'public/bower_components/fontawesome/web-fonts-with-css/css/fontawesome-all.min.css',
        'public/bower_components/open-sans/css/open-sans.min.css',
        'public/bower_components/angular-toastr/dist/angular-toastr.min.css',
        'public/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
        'public/bower_components/summernote/dist/summernote.css',
        'public/bower_components/dropzone/dist/min/dropzone.min.css',
        'public/bower_components/flag-icon-css/css/flag-icon.min.css',
        'public/bower_components/fullcalendar/dist/fullcalendar.min.css',
        'public/bower_components/fullcalendar-scheduler/dist/scheduler.min.css',
        'public/bower_components/chosen/chosen.min.css',
        'public/bower_components/bootstrap-daterangepicker/daterangepicker.css'
      ],
      js: [
        'public/bower_components/jquery/dist/jquery.min.js',
        'public/bower_components/jquery-ui/jquery-ui.min.js',
        'public/bower_components/moment/min/moment.min.js',
        'public/bower_components/moment-timezone/builds/moment-timezone-with-data.min.js',
        'public/bower_components/bootstrap/dist/js/bootstrap.bundle.min.js',
        'public/bower_components/angular/angular.min.js',
        'public/bower_components/ui-bootstrap4/docs/ui-bootstrap-tpls.js',
        'public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'public/bower_components/angular-animate/angular-animate.min.js',
        'public/bower_components/angular-resource/angular-resource.min.js',
        'public/bower_components/angular-messages/angular-messages.min.js',
        'public/bower_components/angular-sanitize/angular-sanitize.min.js',
        'public/bower_components/angular-translate/angular-translate.min.js',
        'public/bower_components/ngMask/dist/ngMask.min.js',
        'public/bower_components/pace/pace.min.js',
        'public/bower_components/jquery-slimscroll/jquery.slimscroll.js',
        'public/bower_components/angular-toastr/dist/angular-toastr.tpls.min.js',
        'public/bower_components/angular-md5/angular-md5.min.js',
        'public/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
        'public/bower_components/angular-eonasdan-datetimepicker/dist/angular-eonasdan-datetimepicker.js',
        'public/bower_components/summernote/dist/summernote.min.js',
        'public/bower_components/angular-summernote/dist/angular-summernote.min.js',
        'public/bower_components/fullcalendar/dist/fullcalendar.min.js',
        'public/bower_components/fullcalendar/dist/gcal.js',
        'public/bower_components/fullcalendar-scheduler/dist/scheduler.min.js',
        'public/bower_components/angular-ui-calendar/src/calendar.js',
        'public/bower_components/chosen/chosen.jquery.min.js',
        'public/bower_components/angular-chosen-localytics/dist/angular-chosen.min.js',
        'public/bower_components/angular-audio/app/angular.audio.js',
        'public/bower_components/checklist-model/checklist-model.js',
        'public/bower_components/ng-file-upload/ng-file-upload-all.min.js',
        'public/bower_components/bootstrap-daterangepicker/daterangepicker.js',
        'public/bower_components/angular-daterangepicker/js/angular-daterangepicker.min.js'

      ]
    },
    css: ['modules/*/client/css/*.css'],
    less: ['modules/*/client/less/*.less'],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: [
      'server.js',
      'config/**/*.js',
      'modules/*/server/**/*.js'
    ],
    models: ['modules/*/server/models/**/*.js'],
    routes: [
      'modules/!(core)/server/routes/**/*.js',
      'modules/core/server/routes/**/*.js'
    ],
    sockets: ['modules/*/server/sockets/**/*.js'],
    configs: ['modules/*/server/config/*.js'],
    policies: ['modules/*/server/policies/*.js'],
    views: ['modules/*/server/views/*.html']
  }
};

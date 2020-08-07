(function() {

  /** Module Configuration */
  angular
    .module('core')
    .constant('googleEventSource', {
      url: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic',
      className: 'gcal-event',
      currentTimezone: 'America/Chicago'
    });
}());

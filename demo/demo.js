var Calendar = require( '../src/moduiCalendar.js' );
var $ = require( 'jquery' );

var calendar = new Calendar();
$('body').append(calendar.el);

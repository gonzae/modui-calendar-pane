var Calendar = require( '../src/moduiCalendar.js' );
var $ = require( 'jquery' );

var calendar = new Calendar({
    numberOfMonths: 2,
    selectedDate: new Date(2015, 4, 2),
    minDate: new Date(2014, 9, 13),
    maxDate: new Date(2015, 4, 23),
    firstVisibleMonth: new Date(2015, 2, 3),
    monthLabels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
    dayLabels: [
        'Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'
    ],
    weekStartsMonday: true,
    getDateClasses: function(date){
        if( (date.getDate() % 3) === 0 ){
            return 'divisible-by-3';
        }
    }
});
$('body').append(calendar.el);

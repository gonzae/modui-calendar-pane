var Super = require( 'modui-base' );
var _ = require( 'underscore' );
var $ = require('jquery');
var fs = require('fs');
var calendarTemplate = fs.readFileSync(__dirname + '/moduiCalendar.html').toString();

module.exports = Super.extend( {
    options : [
        {
            'dayLabels': [
                'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'
            ]
        },
        {
            'numberOfMonths': 1
        },
        'firstVisibleDate',
        'selectedDate',
        'maxDate',
        'minDate',
        'getDateClasses',
        {
            'monthLabels': [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ]
        },
        {
            'weekStartsMonday': false
        },
        {
            'displayYearBeforeMonth': false
        }
    ],
    ui : {
        'nextBtn' : '.next-btn',
        'prevBtn' : '.prev-btn',
        "dayBtn" : 'td.day:not(.out-of-range)'
    },
    events: {
        'click nextBtn': '_onChangeMonthClick',
        'click prevBtn': '_onChangeMonthClick',
        'click dayBtn': '_onDayClick'
    },
    passMessages : { '*' : '.' }, // pass all courier messages directly through to parent view
    className : 'modui-calendar',
    initialize : function() {
        this._currentDate = new Date();
        this._initializeDisplayDates();
        this.render();
    },
    render : function() {
        var calendarHtml = _.template(calendarTemplate)({
            dayLabels: this.dayLabels,
            isPrevBtnDisabled: this._isAtOrBeforeMinMonth(this._firstDisplayDate),
            isNextBtnDisabled: this._isAtOrAfterMaxMonth(this._lastDisplayDate),
            months: this._buildMonths(),
            displayYearBeforeMonth: this.displayYearBeforeMonth
        });

        this.$el.html(calendarHtml);
    },
    goNextMonth: function(){
        this._changeMonth('next');
    },
    goPreviousMonth: function(){
        this._changeMonth('prev');
    },
    setSelectedDate:function(date){
        if(date){
            if(this.minDate && date < this.minDate){
                this.selectedDate = new Date(this.minDate);
            }else if(this.maxDate && date > this.maxDate){
                this.selectedDate = new Date(this.maxDate);
            }else{
                this.selectedDate = date;
            }
        }else{
            this.selectedDate = null;
        }

        this.render();
        this.spawn("dateSelected", this.selectedDate);
    },
    setMinDate:function(date){
        if(date){
            if(this.selectedDate && date > this.selectedDate){
                this.minDate = new Date(this.selectedDate);
            }else if(this.maxDate && date > this.maxDate){
                this.minDate = new Date(this.maxDate);
            }else{
                this.minDate = date;
            }
        }else{
            this.minDate = null;
        }

        return this;
    },
    setMaxDate:function(date){
        if(date){
            if(this.selectedDate && date < this.selectedDate){
                this.maxDate = new Date(this.selectedDate);
            }else if(this.minDate && date < this.minDate){
                this.maxDate = new Date(this.minDate);
            }else{
                this.maxDate = date;
            }
        }else{
            this.maxDate = null;
        }

        return this;
    },
    _changeMonth: function(direction){
        var increment = (direction === "prev" ? -1 : 1) * this.numberOfMonths,
            firstDisplayDate = new Date(
                this._firstDisplayDate.getFullYear(),
                this._firstDisplayDate.getMonth() + increment,
                1
            );

        this._currentDate = new Date();
        this._setDisplayDateRange(firstDisplayDate);
        this.render();
        this.spawn('monthChanged', firstDisplayDate);
    },
    _initializeDisplayDates: function(){
        var date;

        if (this.firstVisibleDate) {
            date = this._withinDateLimits(this.firstVisibleDate);
        } else if (this.selectedDate) {
            date = this.selectedDate;
        } else {
            date = this._withinDateLimits(this._currentDate);
        }

        this._setDisplayDateRange(new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        ));
    },
    _setDisplayDateRange: function(firstDisplayDate){
        this._firstDisplayDate = firstDisplayDate;
        this._lastDisplayDate = new Date(
            firstDisplayDate.getFullYear(),
            firstDisplayDate.getMonth() + this.numberOfMonths - 1,
            1
        );
    },

    /********************
    * Event handlers functions
    *********************/

    _onDayClick:function(e){
        var $day = $(e.currentTarget),
            $month = $day.closest('.modui-month'),
            year = $month.data('year'),
            month = $month.data('month'),
            day = $day.data('day');

        this.setSelectedDate(new Date(year, month, day));
    },
    _onChangeMonthClick:function(e){
        var $elem = $(e.currentTarget);

        e.preventDefault();

        if(!$elem.hasClass("disabled")){
            this._changeMonth($elem.data('nav'));
        }
    },

    /********************
    * Date helper functions
    *********************/

    _withinDateLimits: function(date){
        if(this.minDate && date < this.minDate) {
            return this.minDate;
        }

        if(this.maxDate && date > this.maxDate) {
            return this.maxDate;
        }

        return date;
    },
    _isSameMonth: function(date, date2){
        if(!date || !date2){
            return false;
        }

        return (
            date.getMonth() === date2.getMonth() &&
            date.getFullYear() === date2.getFullYear()
        );
    },
    _isSameDay: function(date, date2){
        return (
            this._isSameMonth(date, date2) &&
            date.getDate() === date2.getDate()
        );
    },
    _isAtOrBeforeMinMonth: function(date){
        if(!this.minDate){
            return false;
        }

        return (
            date.getFullYear() <= this.minDate.getFullYear() &&
            date.getMonth() <= this.minDate.getMonth()
        );
    },
     _isBeforeMinDay: function(date){
        return (
            this._isAtOrBeforeMinMonth(date) &&
            date.getDate() < this.minDate.getDate()
        );
    },
    _isAtOrAfterMaxMonth: function(date){
        if(!this.maxDate){
            return false;
        }

        return (
            date.getFullYear() >= this.maxDate.getFullYear() &&
            date.getMonth() >= this.maxDate.getMonth()
        );
    },
    _isAfterMaxDay: function(date){
        return (
            this._isAtOrAfterMaxMonth(date) &&
            date.getDate() > this.maxDate.getDate()
        );
    },
    _getDaysInMonth:function(date){
        return 32 - (new Date(
            date.getFullYear(),
            date.getMonth(),
            32
        )).getDate();
    },
    _getWeekdayIndexOfFirstDayInMonth: function(date){
        var firstDayOfMonth = (new Date(
                date.getFullYear(),
                date.getMonth(),
                1
            )),
            index = firstDayOfMonth.getDay() - (this.weekStartsMonday ? 1 : 0);

        if(index > - 1) {
          return index;
        }

        return 7 + index;
    },


    /********************
    * Template data building functions
    *********************/

    _buildMonths: function(){
        var i = 0,
            date,
            firstDisplayDate = this._firstDisplayDate,
            firstDisplayDateYear = firstDisplayDate.getFullYear(),
            months = [];

        for(i; i < this.numberOfMonths; i++){
            date = new Date(
                firstDisplayDateYear,
                firstDisplayDate.getMonth() + i,
                1
            );
            months.push({
                isFirst: i === 0,
                label: this.monthLabels[date.getMonth()],
                year: date.getFullYear(),
                index: date.getMonth(),
                weeks: this._buildWeeks(date),
            });
        }
        return months;
    },
    _buildWeeks:function(date){
        var daysBuilt = 0,
            i,
            day,
            weeks = [],
            days,
            dayNumber,
            firstDayIndex = this._getWeekdayIndexOfFirstDayInMonth(date),
            dayCount = this._getDaysInMonth(date),
            daysToBeBuilt = 7 * Math.ceil( (dayCount + firstDayIndex) / 7 );

        while(daysBuilt < daysToBeBuilt){
            days = [];
            for(i = 0; i < 7; i++){
                dayNumber = daysBuilt - firstDayIndex + 1;
                if (daysBuilt < firstDayIndex || dayNumber > dayCount) {
                    day = {};
                } else {
                    date.setDate(dayNumber);
                    day = this._buildDay(date);
                }

                days.push(day);
                ++daysBuilt;
            }
            weeks.push(days);
        }

        return weeks;
    },
    _buildDay: function(date) {
        var day = {
            number: date.getDate(),
            classes: []
        };

        if( this._isSameDay(date, this.selectedDate) ){
            day.classes.push('selected-day');
        }

        if( this._isSameDay(date, this._currentDate) ) {
            day.classes.push('today');
        }

        if(
            this._isBeforeMinDay(date) ||
            this._isAfterMaxDay(date)
        ) {
            day.classes.push('out-of-range disabled');
        }

        if (this.getDateClasses) {
            day.classes.push(
                this.getDateClasses(date)
            );
        }

        day.classes = day.classes.join(' ');
        return day;
    }
} );

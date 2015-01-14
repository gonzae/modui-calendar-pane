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
        this._resetDisplayDate();
    },
    render : function() {
        var calendarHtml = _.template(calendarTemplate)({
            dayLabels: this.dayLabels,
            month: this.monthLabels[this._displayDate.getMonth()],
            year: this._displayDate.getFullYear(),
            isPrevBtnDisabled: this._isAtOrBeforeMinMonth(),
            isNextBtnDisabled: this._isAtOrAfterMaxMonth(),
            weeks: this._buildWeeks(),
            displayYearBeforeMonth: this.displayYearBeforeMonth
        });

        this.$el.html(calendarHtml);
    },
    goNextMonth: function(){
        this._changeMonth(1);
    },
    goPreviousMonth: function(){
        this._changeMonth(-1);
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
        this._resetDisplayDate();
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
    _changeMonth: function(increment){
        var newDisplayDate = new Date(
            this._displayDate.getFullYear(),
            this._displayDate.getMonth() + increment,
            1
        );

        this._currentDate = new Date();
        this._displayDate = newDisplayDate;
        this.render();
        this.spawn('monthChanged', newDisplayDate);
    },
    _resetDisplayDate: function(){
        var date;

        this._currentDate = new Date();
        if (this.selectedDate) {
            date = this.selectedDate;
        } else if (this.firstVisibleDate) {
            date = this.firstVisibleDate;
        } else if(this.minDate && this._currentDate < this.minDate) {
            date = this.minDate;
        } else if(this.maxDate && this._currentDate > this.maxDate) {
            date = this.maxDate;
        } else {
            date = this._currentDate;
        }

        this._displayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        this.render();
    },
    _onDayClick:function(e){
        var $day = $(e.currentTarget),
            day = parseInt($day.attr("data-day"), 10);

        this.setSelectedDate(new Date(
            this._displayDate.getFullYear(),
            this._displayDate.getMonth(),
            day
        ));
    },
    _onChangeMonthClick:function(e){
        var $elem = $(e.currentTarget);

        e.preventDefault();

        if(!$elem.hasClass("disabled")){
            this._changeMonth($elem.data('increment'));
        }
    },
    _isAtOrBeforeMinMonth: function(){
        if (!this.minDate) {
            return false;
        }

        return (
            this._displayDate.getFullYear() <= this.minDate.getFullYear() &&
            this._displayDate.getMonth() <= this.minDate.getMonth()
        );
    },
    _isAtOrAfterMaxMonth: function(){
        if (!this.maxDate) {
            return false;
        }

        return (
            this._displayDate.getFullYear() >= this.maxDate.getFullYear() &&
            this._displayDate.getMonth() >= this.maxDate.getMonth()
        );
    },
    _isMinMonth: function(){
        if (!this.minDate) {
            return false;
        }

        return (
            this._displayDate.getFullYear() === this.minDate.getFullYear() &&
            this._displayDate.getMonth() === this.minDate.getMonth()
        );
    },
    _isMaxMonth: function(){
        if (!this.maxDate) {
            return false;
        }

        return (
            this._displayDate.getFullYear() === this.maxDate.getFullYear() &&
            this._displayDate.getMonth() === this.maxDate.getMonth()
        );
    },
    _isMonthOfSelectedDate: function(){
        if (!this.selectedDate) {
            return false;
        }

        return (
            this.selectedDate.getMonth() === this._displayDate.getMonth() &&
            this.selectedDate.getFullYear() === this._displayDate.getFullYear()
        );
    },
    _isMonthOfCurrentDate: function(){
        return (
            this._currentDate.getMonth() === this._displayDate.getMonth() &&
            this._currentDate.getFullYear() === this._displayDate.getFullYear()
        );
    },
    _getDaysInMonth:function(){
        return 32 - (new Date(
            this._displayDate.getFullYear(),
            this._displayDate.getMonth(),
            32
        )).getDate();
    },
    _getWeekdayIndexOfFirstDayInMonth: function(){
        var index = this._displayDate.getDay() - (this.weekStartsMonday ? 1 : 0);

        if(index > - 1) {
          return index;
        }

        return 7 + index;
    },
    _buildWeeks:function(){
        var daysBuilt = 0,
            i,
            day,
            weeks = [],
            days,
            displayYear = this._displayDate.getFullYear(),
            displayMonth = this._displayDate.getMonth(),
            currentDay = this._currentDate.getDate(),
            firstDayIndex = this._getWeekdayIndexOfFirstDayInMonth(),
            daysInMonth = this._getDaysInMonth(),
            isMinMonth = this._isMinMonth(),
            minDay = isMinMonth ? this.minDate.getDate() : null,
            isMaxMonth = this._isMaxMonth(),
            maxDay = isMinMonth ? this.maxDate.getDate() : null,
            isSelectedMonth = this._isMonthOfSelectedDate(),
            selectedDay = isSelectedMonth ? this.selectedDate.getDate() : null,
            isCurrentMonth = this._isMonthOfCurrentDate(),
            daysToBeBuilt = 7 * Math.ceil( (daysInMonth + firstDayIndex) / 7 );

        while(daysBuilt < daysToBeBuilt){

            days = [];

            for(i = 0; i < 7; i++){
                day = {
                    number: (daysBuilt - firstDayIndex) + 1
                };
                if( daysBuilt < firstDayIndex || day.number > daysInMonth){
                    day.isBlank = true;
                    if( day.number === daysInMonth + 1 ){
                        day.classes = 'first-end-filler';
                    }
                }else{
                    day.classes = [];
                    if( isSelectedMonth && selectedDay === day.number ){
                        day.classes.push('selected-day');
                    }

                    if( isCurrentMonth && currentDay === day.number) {
                        day.classes.push('today');
                    }

                    if(
                        ( isMinMonth && daysBuilt >= firstDayIndex && day.number < minDay) ||
                        ( isMaxMonth && day.number > maxDay && day.number <= daysInMonth )
                    ) {
                        day.classes.push('out-of-range');
                    }

                    if (this.getDateClasses){
                        day.classes.push(
                            this.getDateClasses(new Date(displayYear, displayMonth, day.number))
                        );
                    }

                    day.classes = day.classes.join(' ');
                }

                days.push(day);

                ++daysBuilt;
            }

            weeks.push(days);
        }

        return weeks;
    }
} );

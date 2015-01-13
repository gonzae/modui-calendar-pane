/* globals  SM */

SM.Date = {
    getDaysInMonth:function(month, year){
       return 32 - (new Date(year, month, 32)).getDate();
    },
    getSimpleDate:function(date){
        if(!date){
            return {};
        }

        return {
            month: date.getMonth(),
            year: date.getFullYear(),
            day : date.getDate()
        };
    }
};

SM.CalendarMenuView = SM.Views.register({
    __NAME:"calendarMenuView",
    __templateID:"calendar-menu-template",
    __init:function(){
        this
            .bind("click",".nextBtn", this._onNextMonthClick)
            .bind("click",".prevBtn", this._onPrevMonthClick)
            .bind("click","td.day:not(.out-of-range)", this._onDayClick);

        if(this.__settings.selectMenus){
            this
                .bind("selectMenu.change", ".yearSelect", this._onSelectYearChange)
                .bind("selectMenu.change", ".monthSelect", this._onSelectMonthChange);
        }
    },
    __beforeRender: function(){
        var weekdays = this._buildDayHeaders(),
            calendarData = this.__settings,
            displayDate,
            minDate,
            maxDate,
            selectedDate,
            currentDate,
            isPrevBtnDisabled,
            isNextBtnDisabled,
            culture = Globalize.culture(),
            monthName,
            weeks;

        displayDate = SM.Date.getSimpleDate(this._displayDate);
        minDate= SM.Date.getSimpleDate(calendarData.minDate);
        maxDate = SM.Date.getSimpleDate(calendarData.maxDate);
        selectedDate = SM.Date.getSimpleDate(calendarData.selectedDate);
        currentDate = SM.Date.getSimpleDate(this._currentDate);
        isPrevBtnDisabled = displayDate.year <= minDate.year  && displayDate.month <= minDate.month;
        isNextBtnDisabled = displayDate.year >= maxDate.year && displayDate.month >= maxDate.month;
        monthName = culture.calendars.standard.months.names[displayDate.month],
        weeks = this._buildDays(displayDate, minDate, maxDate, selectedDate, currentDate);

        return {
            weekdays: weekdays,
            monthName: monthName,
            displayDate: displayDate,
            minDate: minDate,
            maxDate: maxDate,
            currentDate: currentDate,
            selectedDate: selectedDate,
            isPrevBtnDisabled: isPrevBtnDisabled,
            isNextBtnDisabled: isNextBtnDisabled,
            selectMenus: calendarData.selectMenus,
            weeks: weeks,
            yearFirst:culture.calendar.yearFirst
        };
    },
    __afterRender: function(md){
        var minMonth,
            maxMonth;
        if(this.__settings.selectMenus){
            this.$el.find(".yearSelect")
                .selectMenu({
                    menuView:"YearSelectMenuView",
                    selectedValue: md.displayDate.year,
                    minYear: md.minDate.year,
                    maxYear: md.maxDate.year
                });

            minMonth = 0;
            maxMonth = 11;

            if( md.minDate.year && md.displayDate.year === md.minDate.year){
                minMonth = md.minDate.month;
            }

            if (md.maxDate.year && md.displayDate.year === md.maxDate.year){
                maxMonth = md.maxDate.month;
            }

            this.$el.find(".monthSelect")
                .selectMenu({
                    menuView:"MonthSelectMenuView",
                    selectedValue: md.displayDate.month,
                    minMonth: minMonth,
                    maxMonth: maxMonth
                });
        }
    },
    resetDisplayDate: function(settings){
        var simpleDate,
            calendarData = this.__settings = settings;

        this._currentDate = new Date();
        if(calendarData.selectedDate){
            simpleDate = SM.Date.getSimpleDate(calendarData.selectedDate);
        }else if(calendarData.minDate && this._currentDate < calendarData.minDate){
            simpleDate = SM.Date.getSimpleDate(calendarData.minDate);
        }else if(calendarData.maxDate && this._currentDate > calendarData.maxDate){
            simpleDate = SM.Date.getSimpleDate(calendarData.maxDate);
        }else{
            simpleDate = SM.Date.getSimpleDate(this._currentDate);
        }

        this._displayDate = new Date(simpleDate.year, simpleDate.month, 1);
    },
    _setDisplayDate:function(year, month){
        var date = new Date(year, month, 1);
        this._currentDate = new Date();
        this._displayDate = date;
    },
    _buildDayHeaders:function(){
        var culture = Globalize.culture(),
            calendar = culture.calendars.standard,
            i = calendar.firstDay,
            days = calendar.days.names,
            shortDays = calendar.days.namesShort,
            normalizedIndex,
            weekdays = [],
            dayCount = 7;

        while(dayCount){
            normalizedIndex = i < 7 ? i : i - 7;
            weekdays.push({
                name: days[normalizedIndex],
                shortName: shortDays[normalizedIndex]
            });
            dayCount--;
            i++;
        }

        return weekdays;
    },
    _buildDays:function(displayDate, minDate, maxDate, selectedDate, currentDate){
        var daysBuilt = 0,
            i,
            day,
            dayNumber,
            selectedMonth = selectedDate.month,
            selectedYear = selectedDate.year,
            selectedDay = selectedDate.day,
            currentMonth = currentDate.month,
            currentYear = currentDate.year,
            currentDay = currentDate.day,
            minMonth = minDate.month,
            minYear = minDate.year,
            minDay = minDate.day,
            maxDay = maxDate.day,
            maxMonth = maxDate.month,
            maxYear = maxDate.year,
            weeks = [],
            days,
            displayMonth = displayDate.month,
            displayYear = displayDate.year,
            firstDayIndex = Globalize.getWeekdayIndexOfFirstDay(displayMonth, displayYear),
            daysInMonth = SM.Date.getDaysInMonth(displayMonth, displayYear),
            isMinMonth = minMonth === displayMonth && minYear === displayYear,
            isMaxMonth = maxMonth === displayMonth && maxYear === displayYear,
            isSelectedMonth = selectedMonth === displayMonth && selectedYear === displayYear,
            isCurrentMonth = currentMonth === displayMonth && currentYear === displayYear,
            daysToBeBuilt = 7 * Math.ceil( (daysInMonth + firstDayIndex) / 7 );

        while(daysBuilt < daysToBeBuilt){

            days = [];

            for(i = 0; i < 7; i++){
                dayNumber = (daysBuilt - firstDayIndex) + 1;
                if( daysBuilt < firstDayIndex || dayNumber > daysInMonth){
                    day = {
                        isBlank: true,
                        isFirstEnd: dayNumber === daysInMonth + 1
                    };
                }else{
                    day = {
                        number: dayNumber,
                        isLast: dayNumber === daysInMonth,
                        isSelected: isSelectedMonth && selectedDay === dayNumber,
                        isToday: isCurrentMonth && currentDay === dayNumber,
                        isOutOfRange: (
                            ( isMinMonth && daysBuilt >= firstDayIndex && dayNumber < minDay) ||
                            ( isMaxMonth && dayNumber > maxDay && dayNumber <= daysInMonth )
                        )
                    };
                }

                days.push(day);

                ++daysBuilt;
            }

            weeks.push(days);
        }

        return weeks;
    },
    //EVENTS
    _onPrevMonthClick:function(e){
        var self = e.data.self,
            displayDate = SM.Date.getSimpleDate(self._displayDate),
            $elem = $(this);

        e.preventDefault();
        e.stopPropagation();

        if(!$elem.hasClass("disabled")){
            self._setDisplayDate(displayDate.year, displayDate.month - 1);
            self.render();
        }
    },
    _onNextMonthClick:function(e){
        var self = e.data.self,
            $elem = $(this),
            displayDate = SM.Date.getSimpleDate(self._displayDate);

        e.preventDefault();
        e.stopPropagation();

        if(!$elem.hasClass("disabled")){
            self._setDisplayDate(displayDate.year, displayDate.month + 1);
            self.render();
        }
    },
    _onSelectYearChange:function(e){
        var self = e.data.self,
            month,
            year,
            calendarData = self.__settings,
            minDate= SM.Date.getSimpleDate(calendarData.minDate),
            maxDate = SM.Date.getSimpleDate(calendarData.maxDate),
            displayDate = SM.Date.getSimpleDate(self._displayDate);

        year = parseInt(e.value, 10);
        month = displayDate.month;

        if( minDate.year && year === minDate.year && minDate.month > displayDate.month){
            month = minDate.month;
        }

        if( maxDate.year && year === maxDate.year && maxDate.month < displayDate.month){
            month = maxDate.month;
        }

        self._setDisplayDate(year, month);
        self.render();
    },
    _onSelectMonthChange:function(e){
        var self = e.data.self,
            displayDate = SM.Date.getSimpleDate(self._displayDate);

        self._setDisplayDate(displayDate.year, parseInt(e.value, 10));
        self.render();
    },
    _onDayClick:function(e){
        var self = e.data.self,
            $day = $(e.currentTarget),
            day = parseInt($day.attr("data-day"), 10),
            displayDate = SM.Date.getSimpleDate(self._displayDate);

        self.trigger({
            type:"dateSelected",
            date:new Date(displayDate.year, displayDate.month, day)
        });
    }
});
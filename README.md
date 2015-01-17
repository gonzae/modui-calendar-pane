# modui-calendar

A calendar for the backbone.js-based modui suite.

## Installation

```
npm install modui-calendar
```

## Usage


```javascript
var ModuiCalendar = require( 'modui-calendar' );

var calendar = new ModuiCalendar([options]);
```

### Options

#### `numberOfMonths`

`Number` The number of months to display vertically. Defaults to 1.

#### `firstVisibleMonth`

`Number` A zero based index reference to the month that should be initially displayed (e.g. 0 = Jan, 11 = Dec) if there is no selected date. Defaults to the current month. If there is a selectedDate, the selectedDate month will be displayed.

#### `selectedDate`

`Date` The date to display as the current selected date. Defaults to none.  If a selectedDate is set it will override the `firstVisibleMonth`.

#### `maxDate`

`Date` The maximum date to which the calendar can be selected.

#### `minDate`

`Date` The minimum date to which the calendar can be selected.

#### `getDateClasses`

`Function` A callback that is invoked for upon rendering each day in the calendar.  It is passed a date object representing that day and should return a string of space separted css classes to be added to that day element. Defaults to none.

#### `dayLabels`

`Array` An array of strings that should be used as the day display labels.  This is useful for i18n. Defaults to

```
['Su', ..., Sa']
```

#### `monthLabels`

`Array` An array of strings that should be used as the month display labels. This is useful for i18n. Defaults to

```
['January', ...,'December']
```

#### `weekStartsOnMonday`

`bool` A boolean to display monday as the first day of the week.  This is useful for i18n.

#### `displayMonthBeforeYear`

`bool` A boolean to display the month before year vs. the year befor the month.  This is useful for i18n.

### Public Methods

#### `goNextMonth`

Moves calendar display to the next month.

#### `goPreviousMonth`

Moves calendar display to the previous month.

#### `setSelectedDate`

Takes a `Date` object and sets the selected display date.

#### `getSelectedDate`

Returns a `Date` object representing the selected date.

### Events

#### `dateSelected`

Triggered when the selectedDate is set.  This can be done either via the public method `setSelectedDate` or by selecting a date in the UI.  The event callback will be passed a `Date` object of the date that was selected.

#### `monthChanged`

Triggered when the displayMonth changes.  This can be done either via the public methods `goNextMonth` and `goPreviousMonth` or by navigating months in the UI.  The event callback will be passed a `Date` object representing the first day of that month.

## License
MIT

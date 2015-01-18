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

`Date` A date that has the year and month set to the month/year that you want to display initially. While the value of `firstVisibleMonth` has no default, an initial month/year will be determined if it is not set. If there is a `selectedDate`, the `selectedDate` month will be displayed initially. If neither `firstVisibleMonth` or `selectedDate` are set the current month is displayed initially.

#### `selectedDate`

`Date` The date to display as the current selected date. No default.

#### `maxDate`

`Date` The maximum date that can be selected. No default.

#### `minDate`

`Date` The minimum date that can be selected. No default.

#### `getDateClasses`

`Function` A callback that is called when rendering each day in the calendar.  It is passed a date object representing that day and should return a `String` of space separated css classes to be added to that day element. No default.

#### `dayLabels`

`Array` An array of strings that should be used as the day display labels.  This is useful for i18n. Defaults to `['Su', ..., Sa']`. The list should always start with what you want to represent Sunday.  If you want your calendar weeks to begin with 	Monday, use the `weekStartsOnMonday` option.

#### `monthLabels`

`Array` An array of strings that should be used as the month display labels. This is useful for i18n. Defaults to `['January', ...,'December']`. The list should always start with what you want to represent January.

#### `weekStartsOnMonday`

`bool` A boolean to display monday as the first day of the week.  This is useful for i18n. Defaults to `false`.

#### `displayYearBeforeMonth`

`bool` A boolean to display the year before the month vs. the month before the year.  This is useful for i18n. Defaults to `false`.

### Public Methods

#### `goNextMonth`

Moves the calendar display to the next month.

#### `goPreviousMonth`

Moves the calendar display to the previous month.

### Events

#### `dateSelected`

Triggered when `selectedDate` is set.  This can be done either via the public method `setOptions({selectedDate: someDate})` or by selecting a date in the UI.  The event callback will be passed a `Date` object of the date that was selected.

#### `monthChanged`

Triggered when the displayMonth changes.  This can be done either via the public methods `goNextMonth` and `goPreviousMonth` or by navigating months in the UI.  The event callback will be passed a `Date` object representing the first day of the new display month. If `numberOfMonths` is greater than 1, the callback will be passed a `Date` representing the first day of the first month that is displayed.

## Development

modui-calendar is a CommonJs module. To compile it you can you use browserify. The module also leverages sass for it's style.  The following commands may be handy for development.

```
# developing the js
$ watchify -t /path/to/brfs /path/to/modui-calendar/demo/demo.js -o /path/to/modui-calenar/build/demo.js --debug

# developing the scss
$ sass --watch /path/to/modui-calendar/demo/demo.scss:/path/to/modui-calendar/build/demo.css
```

You can then review your changes the output in the demo.html file.

## Build

```
# making js build
$ browserify -t /path/to/brfs /path/to/modui-calendar/src/moduiCalendar.js > /path/to/modui-calenar/build/moduiCalendar.js

# making scss build
sass /path/to/modui-calendar/src/moduiCalendar.scss:/path/to/modui-calendar/build/moduiCalendar.css --style compressed
```

## License
MIT

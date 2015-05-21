# modui-calendar

A calendar for the backbone.js-based modui suite. By [Adrian Adkison](https://github.com/trainiac).

## Installation

```
npm install modui-calendar
```

## Usage

```javascript
var ModuiCalendar = require( 'modui-calendar' );

var calendar = new ModuiCalendar( [options] );
```

### Options

#### `selectedDate`

`Date` The date to display as the current selected date. If this option is not supplied no date will be initially selected.

#### `maxDate`

`Date` The maximum date that can be selected, or undefined (default) if no maximum should be enforced.

#### `minDate`

`Date` The minimum date that can be selected, or undefined (default) if no minimum should be enforced.

#### `numberOfMonths`

`Number` The number of months to display vertically. Defaults to 1.

#### `firstVisibleMonth`

`Date` A date that has the year and month set to that which you want to display initially. If no value is supplied for this option, and a `selectedDate` is supplied, the month of the `selectedDate` will be displayed. If neither `firstVisibleMonth` or `selectedDate` are supplied then the current month (i.e. NOW) is displayed.

#### `getDateClasses( date )`

`Function` If supplied, this callback will be invoked when rendering each day in the calendar. It will be passed a date object representing that day and should return a `String` of space-separated css classes to be added to that day's HTML element.

### Internationalization Options

#### `dayLabels`

`Array` An array of strings that should be used as the day display labels. Defaults to `[ 'Su', ..., Sa' ]`. The array should always start with the string that represents Sunday. (If you want your calendar weeks to begin with Monday, use the `weekStartsOnMonday` option.)

#### `monthLabels`

`Array` An array of strings that should be used as the month display labels. Defaults to `[ 'January', ...,'December' ]`.

#### `weekStartsOnMonday`

`bool` If `true`, Monday displayed as the first day of the week instead of Sunday.

#### `displayYearBeforeMonth`

`bool` Does what it says. Defaults to `false`.

### Public Methods

#### `goNextMonth`

Moves the calendar display to the next month.

#### `goPreviousMonth`

Moves the calendar display to the previous month.

### Events

The following events are triggered with [Backbone.Courier](https://github.com/rotundasoftware/backbone.courier), so you can either `listenTo` them normally or handle them in a Courier `onMessages` hash.

#### `dateSelected (date)`

Triggered when the `selectedDate` is changed, either via the public method `setOptions( {selectedDate : someDate} )` or by the user selecting a date in the UI. The event callback will be passed a `Date` object representing the date that was selected.

#### `monthChanged (firstDayOfMonth)`

Triggered when the month being displayed changes, either via the public methods `goNextMonth` and `goPreviousMonth` or by the user navigating months in the UI. The event callback will be passed a `Date` object representing the first day of the new display month. (If `numberOfMonths` is greater than 1, the `Date` will represent the first day of the first month.)

## Development

modui-calendar is a CommonJS module. To compile its assets you can you use browserify and sass.

```
# developing the js
$ watchify /path/to/modui-calendar/demo/demo.js -o /path/to/modui-calenar/build/demo.js --debug

# developing the scss
$ sass --watch /path/to/modui-calendar/demo/demo.scss:/path/to/modui-calendar/build/demo.css
```

Or you can compile both asset types at once with [parcelify](https://github.com/rotundasoftware/parcelify),


```
$ parcelify demo/demo.js -j build/demo.js -c build/demo.css -wm
```

Then review your changes by loading the demo.html file.

## Build

Similarly, to build for production,


```
$ parcelify demo/demo.js -j build/demo.js -c build/demo.css
```

## License

MIT

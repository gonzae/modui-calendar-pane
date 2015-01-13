var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    notify = require('gulp-notify'),
    gutil = require('gulp-util'),
    prettyHrtime = require('pretty-hrtime'),
    startTime;

function startLog(filepath) {
    startTime = process.hrtime();
    gutil.log('Bundling', gutil.colors.green(filepath) + '...');
}

function endLog(filepath) {
    var taskTime = process.hrtime(startTime),
        prettyTime = prettyHrtime(taskTime);
    gutil.log('Bundled', gutil.colors.green(filepath), 'in', gutil.colors.magenta(prettyTime));
}

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
}

gulp.task('browserify', function(cb) {
    watchify(browserify({
        // required for watchify
        cache: {},
        packageCache: {},
        fullPaths: true,

        // Enable source maps
        debug: true,
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: '../moduiCalendar.js',
            dest: '../build/',
            outputName: 'moduiCalendar.js'
        }]
    })).on('update', function() {
        startLog('moduiCalendar');
        this.bundler
            .bundle()
                // Report compile errors
                .on('error', handleErrors)
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
            .pipe(source('moduiCalendar.js'))
            .pipe(buffer())
                // Report compile errors
                .on('error', handleErrors)
            // Specify the output destination
            .pipe(gulp.dest('build/js/moduiCalendar.js'));
        endLog('moduiCalendar');
        cb();
    });
});

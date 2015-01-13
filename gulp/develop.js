var gulp = require('gulp');

gulp.task('develop', ['scss', 'browserify'], function() {
    /*
        The develop task is meant to be run for development.
        It does the following:

            - Watches and compiles browserify files
            - Watches and compiles scss files/

    */

    gulp.watch('../moduiCalendar.scss', ['scss']);
});
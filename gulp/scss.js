var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    changed = require('gulp-changed');

gulp.task('scss', function() {
    return gulp.src('../moduiCalender.scss')
            .pipe(sass({
                errLogToConsole: true,
                outputStyle: 'compressed'
            }))
            .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2', 'Firefox ESR'))
        .pipe(changed('../build', {hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest('/build'));
});
const autoprefixer = require('gulp-autoprefixer');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const trash = require('trash');



/**
 * index.css
 */

const logWatchEvent = (event) => {
  console.log(`${event.path} ${event.type}`);
};

/**
 * Generate index.css and its sourcemap.
 */
gulp.task('sass', function() {
  return gulp
  .src('src/index.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'));
});

/**
 * Delete index.css and its sourcemap.
 */
gulp.task('sass:clean', function() {
  trash(['index.css', 'index.css.map']);
});

/**
 * Rebuild index.css and its sourcemap each time a scss file changes.
 */
gulp.task('sass:watch', ['sass'], function() {
  return gulp
  .watch('src/**/*.scss', ['sass'])
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
});

gulp.task('build', [/*'html',*/'sass'/*,'ts'*/]);

gulp.task('clean', [/*'html:clean',*/'sass:clean'/*,'ts:clean'*/]);

gulp.task('watch', [/*'html:watch',*/'sass:watch'/*,'ts:watch'*/]);

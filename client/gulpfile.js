const autoprefixer = require('gulp-autoprefixer');
const fs = require('fs');
const gulp = require('gulp');
const htmlInjector = require('html-injector');
const htmlMinifierStream = require('html-minifier-stream');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const trash = require('trash');


const logWatchEvent = (event) => {
 console.log(`${event.path} ${event.type}`);
};



/**
 * index.html
 */

/**
 * Generate index.html
 */
gulp.task('html', ['html:clean', 'sass'], function() {
  fs.createReadStream('src/index.html')
  .pipe(htmlInjector('templates', null, ['src/modules/**/*.html']))
  .pipe(htmlInjector('css', null, ['index-*.css']))
  .pipe(htmlInjector('js', { app: 'index.js', vendor: 'vendor.js' }))
  .pipe(htmlMinifierStream({
    collapseWhitespace: true,
    processScripts: ['text/ng-template']
  }))
  .pipe(fs.createWriteStream('index.html'));
});

/**
 * Clean index.html
 */
gulp.task('html:clean', function() {
  trash(['index.html']);
});

/**
 * Rebuild index.html whenever any html file changes.
 */
gulp.task('html:watch', ['html'], function() {
  return gulp
  .watch(['src/**/*.html'], ['html'])
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
});



/**
 * index.css
 */

/**
 * Generate index.css and its sourcemap.
 */
gulp.task('sass', ['sass:clean'], function() {
  return gulp
  .src('src/index.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'));
});

/**
 * Delete index.css and its sourcemap.
 */
gulp.task('sass:clean', function() {
  trash(['index-*.css', 'index-*.css.map']);
});

/**
 * Rebuild index.css and its sourcemap whenever any scss file changes.
 * Rebuild index.html to update index.css hash.
 */
gulp.task('sass:watch', ['sass'], function() {
  return gulp
  .watch('src/**/*.scss', ['sass', 'html'])
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
});

gulp.task('build', ['html', 'sass'/*,'ts'*/]);

gulp.task('clean', ['html:clean', 'sass:clean'/*,'ts:clean'*/]);

gulp.task('watch', ['html:watch', 'sass:watch'/*,'ts:watch'*/]);

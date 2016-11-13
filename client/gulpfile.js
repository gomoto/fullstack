const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const fs = require('fs');
const gulp = require('gulp');
const htmlInjector = require('html-injector');
const htmlMinifierStream = require('html-minifier-stream');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const trash = require('trash');
const tsify = require('tsify');
const uglify = require('gulp-uglify');
const watchify = require('watchify');


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
gulp.task('html:clean', function(done) {
  trash(['index.html']).then(done);
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
gulp.task('sass:clean', function(done) {
  trash(['index-*.css', 'index-*.css.map']).then(done);
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



/**
 * index.js
 */

/**
 * Generate index.js and its sourcemap.
 */
gulp.task('ts', ['ts:clean'], function() {
  bundle(createBrowserifier());
});

/**
 * Delete index.js and its sourcemap.
 */
gulp.task('ts:clean', function(done) {
  trash(['index-*.js', 'index-*.js.map']).then(done);
});

/**
 * Rebuild index.js and its sourcemap whenever any ts file changes.
 * Rebuild index.html to update index.js hash.
 */
gulp.task('ts:watch', ['ts'], function() {
  bundle(createBrowserifier(true));
});



function createBrowserifier(watchMode) {
  const options = {
    debug: true
  };

  if (watchMode) {
    options.cache = {};
    options.packageCache = {};
  }

  const browserifier = browserify(options)
  .add('src/index.ts')
  .plugin(tsify, { project: 'tsconfig.json' });

  if (watchMode) {
    browserifier.plugin(watchify)
    .on('update', (ids) => {
      console.log(ids);
      bundle(browserifier);
    })
    .on('log', console.log);
  }

  return browserifier;
}



function bundle(browserifier) {
  browserifier.bundle()
  .on('error', console.error)
  .pipe(source('index.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(uglify())
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'));
}



gulp.task('build', ['html', 'sass', 'ts']);

gulp.task('clean', ['html:clean', 'sass:clean', 'ts:clean']);

gulp.task('watch', ['html:watch', 'sass:watch', 'ts:watch']);

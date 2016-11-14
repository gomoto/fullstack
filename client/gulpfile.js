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
gulp.task('html', ['sass'], function() {
  rebuildHtml();
});

/**
 * Clean index.html
 */
gulp.task('html:clean', function(done) {
  cleanHtml().then(done);
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
 * Build html files.
 * FIXME: In build task, this gets called twice because of buildJs().
 */
function buildHtml() {
  fs.createReadStream('src/index.html')
  .pipe(htmlInjector('templates', null, ['src/modules/**/*.html']))
  .pipe(htmlInjector('css', null, ['index-*.css']))
  .pipe(htmlInjector('js', null, ['index-*.js']))
  .pipe(htmlMinifierStream({
    collapseWhitespace: true,
    processScripts: ['text/ng-template']
  }))
  .pipe(fs.createWriteStream('index.html'));
}

/**
 * Clean html files.
 * @return {promise}
 */
function cleanHtml() {
  return trash(['index.html']);
}

/**
 * Clean and rebuild html files.
 */
function rebuildHtml() {
  cleanHtml().then(buildHtml);
}



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
gulp.task('ts', function() {
  rebuildJs(createBrowserifier('src/index.ts'));
});

/**
 * Delete index.js and its sourcemap.
 */
gulp.task('ts:clean', function(done) {
  cleanJs().then(done);
});

/**
 * Rebuild index.js and its sourcemap whenever any ts file changes.
 * Rebuild index.html to update index.js hash.
 */
gulp.task('ts:watch', function() {
  // watchify requires extra options
  const browserifier = createBrowserifier('src/index.ts', {
    cache: {},
    packageCache: {},
    plugin: [watchify]
  });

  browserifier.on('update', (ids) => {
    console.log(ids);
    rebuildJs(browserifier);
  });

  browserifier.on('log', console.log);

  rebuildJs(browserifier);
});

/**
 * Build js files, then rebuild html files.
 * @param  {Browserify} browserifier
 */
function buildJs(browserifier) {
  bundle(browserifier, 'index.js', function() {
    rebuildHtml();
  });
}

/**
 * Clean js files.
 * @return {promise}
 */
function cleanJs() {
  return trash(['index-*.js', 'index-*.js.map']);
}

/**
 * Clean and rebuild js files.
 * @param  {Browserify} browserifier
 */
function rebuildJs(browserifier) {
  cleanJs().then(function() {
    buildJs(browserifier);
  });
}



/**
 * Vendor
 */

/**
 * Generate vendor.js and its sourcemap.
 */
gulp.task('vendor', function() {
  rebuildVendor(createBrowserifier('src/vendor.ts'));
});

/**
 * Delete vendor.js and its sourcemap.
 */
gulp.task('vendor:clean', function(done) {
  cleanVendor().then(done);
});

/**
 * Rebuild vendor.js and its sourcemap whenever vendor.ts file changes.
 * Rebuild index.html to update vendor.js hash.
 */
gulp.task('vendor:watch', function() {
  // watchify requires extra options
  const browserifier = createBrowserifier('src/vendor.ts', {
    cache: {},
    packageCache: {},
    plugin: [watchify]
  });

  browserifier.on('update', (ids) => {
    console.log(ids);
    rebuildVendor(browserifier);
  });

  browserifier.on('log', console.log);

  rebuildVendor(browserifier);
});

/**
 * Build vendor files, then rebuild html files.
 * @param  {Browserify} browserifier
 */
function buildVendor(browserifier) {
  bundle(browserifier, 'vendor.js', function() {
    rebuildHtml();
  });
}

/**
 * Clean vendor files.
 * @return {promise}
 */
function cleanVendor() {
  return trash(['vendor-*.js', 'vendor-*.js.map']);
}

/**
 * Clean and rebuild vendor files.
 * @param  {Browserify} browserifier
 */
function rebuildVendor(browserifier) {
  cleanVendor().then(function() {
    buildVendor(browserifier);
  });
}

/**
 * Create a browserify instance.
 * @param  {BrowserifyOptions} options
 * @return {Browserify} instance
 */
function createBrowserifier(entry, options) {
  options = options || {};
  options.debug = true;
  return browserify(options)
  .add(entry)
  .plugin(tsify, { project: 'tsconfig.json' });
}

/**
 * Bundle the given browserify instance.
 * Call the given callback after bundle is written to disk.
 * @param  {browserify} browserifier
 * @param  {Function} callback
 */
function bundle(browserifier, name, callback) {
  browserifier.bundle()
  .on('error', console.error)
  .pipe(source(name))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(uglify())
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'))
  .on('finish', function() {
    if (typeof callback === 'function') {
      callback();
    }
  });
}



gulp.task('build', ['html', 'sass', 'ts', 'vendor']);

gulp.task('clean', ['html:clean', 'sass:clean', 'ts:clean', 'vendor:clean']);

gulp.task('watch', ['html:watch', 'sass:watch', 'ts:watch', 'vendor:watch']);

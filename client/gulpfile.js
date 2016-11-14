const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const fs = require('fs');
const gulp = require('gulp');
const htmlInjector = require('html-injector');
const htmlMinifierStream = require('html-minifier-stream');
const mergeStream = require('merge-stream');
const Promise = require('pinkie-promise');
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
function buildHtml(done) {
  console.log('buildHtml');
  fs.createReadStream('src/index.html')
  .pipe(htmlInjector('templates', null, ['src/modules/**/*.html']))
  .pipe(htmlInjector('css', null, ['index-*.css']))
  .pipe(htmlInjector('js', null, ['index-*.js']))
  .pipe(htmlMinifierStream({
    collapseWhitespace: true,
    processScripts: ['text/ng-template']
  }))
  .pipe(fs.createWriteStream('index.html'))
  .on('finish', done);
}

/**
 * Clean html files.
 * @return {promise}
 */
function cleanHtml() {
  console.log('cleanHtml');
  return trash(['index.html']);
}

/**
 * Clean and rebuild html files.
 */
function rebuildHtml(done) {
  console.log('rebuildHtml');
  cleanHtml().then(() => {
    buildHtml(done);
  });
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
 * JS
 */



/**
 * Bundle specifications.
 * Each bundle cleans itself up before rebundling.
 */
const bundles = [{
  entries: ['src/index.ts'],
  output: 'index.js',
  destination: '.',
  pre: (done) => {
    console.log('pre-app');
    cleanJsApp().then(done);
  },
  post: () => {
    console.log('post-app');
    rebuildHtml();
  }
}, {
  entries: ['src/vendor.ts'],
  output: 'vendor.js',
  destination: '.',
  pre: (done) => {
    console.log('pre-vendor');
    cleanJsVendor().then(done);
  },
  post: () => {
    console.log('post-vendor');
    rebuildHtml();
  }
}];



/**
 * Create a single js bundle.
 * Hooks pre and post are not called on initial bundle.
 * @param  {string[]} options.entries array of bundle entry files
 * @param  {string} options.output name of bundle file
 * @param  {string} options.destination directory containing bundle file
 * @return {stream} browserifyBundleStream
 */
const createBundle = (options, isWatchify) => {
  const browserifyOptions = {
    cache: {},
    packageCache: {},
    entries: options.entries,
    debug: true
  };

  const b = browserify(browserifyOptions)
  .plugin(tsify, { project: 'tsconfig.json' });

  const rebundle = (callback) => {
    return b.bundle()
    .on('error', console.error)
    .pipe(source(options.output))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rev())
    .pipe(sourcemaps.write(options.destination))
    .pipe(gulp.dest(options.destination))
    .on('finish', function() {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  if (isWatchify) {
    b.plugin(watchify);
    b.on('update', (ids) => {
      console.log(ids);
      options.pre(() => {
        rebundle(options.post);
      });
    });
    b.on('log', console.log);
  }

  return rebundle();
};



/**
 * Build js files, then rebuild html files.
 * @param {boolean} isWatching
 * @param {Function} done
 */
function buildJs(isWatching, done) {
  console.log('buildJs');
  const bundleStreams = bundles.map((bundle) => {
    return createBundle(bundle, isWatching);
  });
  mergeStream(...bundleStreams)
  .on('finish', () => {
    rebuildHtml(done);
  });
}

/**
 * Clean js files.
 * @return {promise}
 */
function cleanJs() {
  console.log('cleanJs');
  return Promise.all([cleanJsApp(), cleanJsVendor()]);
}

/**
 * Clean app js files.
 * @return {promise}
 */
function cleanJsApp() {
  console.log('cleanJsApp');
  return trash(['index-*.js', 'index-*.js.map']);
}

/**
 * Clean vendor js files.
 * @return {promise}
 */
function cleanJsVendor() {
  console.log('cleanJsVendor');
  return trash(['vendor-*.js', 'vendor-*.js.map']);
}

/**
 * Generate js files and their sourcemaps.
 */
gulp.task('js', function(done) {
  cleanJs().then(() => {
    buildJs(false, done);
  });
});

/**
 * Delete js files and their sourcemaps.
 */
gulp.task('js:clean', function(done) {
  cleanJs().then(done);
});

/**
 * Rebuild each bundle and its sourcemap whenever a file changes within it.
 * Rebuild index.html to update js file hashes.
 */
gulp.task('js:watch', function(done) {
  cleanJs().then(() => {
    buildJs(true, done);
  });
});



gulp.task('build', ['html', 'sass', 'js']);

gulp.task('clean', ['html:clean', 'sass:clean', 'js:clean']);

gulp.task('watch', ['html:watch', 'sass:watch', 'js:watch']);

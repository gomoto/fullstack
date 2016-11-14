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
  return buildCss();
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

function buildCss() {
  console.log('buildCss');
  return gulp.src('src/index.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'));
}


/**
 * JS
 */

// NOTE: When using watchify and tsify together, updating a typescript file in
// one bundle triggers an update event in all bundles. Stick to one typescript
// bundle until this is resolved.

const js = {
  entries: ['src/index.ts'],
  output: 'index.js',
  destination: '.',
  // Bundle cleans itself up before rebundling
  pre: (done) => {
    console.log('pre-js');
    cleanJs().then(done);
  },
  post: () => {
    console.log('post-js');
    rebuildHtml(() => {
      console.log('index.html updated');
    });
  }
};

/**
 * Create a single js bundle.
 * Hooks pre and post are not called on initial bundle.
 * @param  {string[]} bundle.entries array of bundle entry files
 * @param  {string} bundle.output name of bundle file
 * @param  {string} bundle.destination directory containing bundle file
 * @param  {Function} bundle.pre pre-bundle hook
 * @param  {Function} bundle.post pose-bundle hook
 * @return {stream} browserifyBundleStream
 */
function buildJs(isWatchify) {
  console.log('buildJs');

  const browserifyOptions = {
    cache: {},
    packageCache: {},
    entries: js.entries,
    debug: true
  };

  const b = browserify(browserifyOptions)
  .plugin(tsify, { project: 'tsconfig.json' });

  const rebundle = (callback) => {
    return b.bundle()
    .on('error', console.error)
    .pipe(source(js.output))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rev())
    .pipe(sourcemaps.write(js.destination))
    .pipe(gulp.dest(js.destination))
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
      js.pre(() => {
        rebundle(js.post);
      });
    });
    b.on('log', console.log);
  }

  return rebundle();
};



const vendor = {
  output: 'vendor.js',
  destination: '.'
};

function buildVendor() {
  console.log('buildVendor');

  const b = browserify({ debug: true });

  require('./src/vendors.json').forEach((vendor) => {
    b.require(vendor);
  });

  return b.bundle()
  .on('error', console.error)
  .pipe(source(vendor.output))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(uglify())
  .pipe(rev())
  .pipe(sourcemaps.write(vendor.destination))
  .pipe(gulp.dest(vendor.destination));
};



/**
 * Clean app js files.
 * @return {promise}
 */
function cleanJs() {
  console.log('cleanJs');
  return trash(['index-*.js', 'index-*.js.map']);
}

/**
 * Clean vendor js files.
 * @return {promise}
 */
function cleanVendor() {
  console.log('cleanVendor');
  return trash(['vendor-*.js', 'vendor-*.js.map']);
}



/**
 * Generate js files and their sourcemaps.
 */
gulp.task('js', function(done) {
  cleanJs().then(() => {
    buildJs(false).on('finish', () => {
      rebuildHtml(done);
    });
  });
});

/**
 * Delete js files and their sourcemaps.
 */
gulp.task('js:clean', function(done) {
  cleanJs().then(done);
});

/**
 * Rebuild js bundle and its sourcemap whenever a file changes within it.
 * Rebuild index.html to update js file hash.
 */
gulp.task('js:watch', function(done) {
  cleanJs().then(() => {
    buildJs(true).on('finish', () => {
      rebuildHtml(done);
    });
  });
});

/**
 * Generate vendor js files and their sourcemaps.
 */
gulp.task('vendor', function(done) {
  cleanVendor().then(() => {
    buildVendor().on('finish', () => {
      rebuildHtml(done);
    });
  });
});

/**
 * Delete vendor js files and their sourcemaps.
 */
gulp.task('vendor:clean', function(done) {
  cleanVendor().then(done);
});

/**
 * Rebuild vendor bundle and its sourcemap whenever a file changes within it.
 * Rebuild index.html to update vendor file hash.
 */
gulp.task('vendor:watch', function() {
  return gulp.watch('src/vendors.json', ['vendor'])
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
});




gulp.task('build', function(done) {
  mergeStream([
    buildCss(),
    buildJs(false),
    buildVendor()
  ])
  .on('finish', function() {
    buildHtml(done);
  })
});

gulp.task('clean', ['html:clean', 'sass:clean', 'js:clean', 'vendor:clean']);

gulp.task('watch', ['html:watch', 'sass:watch', 'js:watch', 'vendor:watch']);

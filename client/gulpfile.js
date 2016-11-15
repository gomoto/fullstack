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
 * HTML
 */



/**
 * Generate index.html
 * @param  {Function} done called once index.html is written to disk
 */
function buildHtml(done) {
  console.time('buildHtml');
  fs.createReadStream('src/index.html')
  .pipe(htmlInjector('templates', null, ['src/modules/**/*.html']))
  .pipe(htmlInjector('css', null, ['index-*.css']))
  .pipe(htmlInjector('js', null, ['index-*.js']))
  .pipe(htmlMinifierStream({
    collapseWhitespace: true,
    processScripts: ['text/ng-template']
  }))
  .pipe(fs.createWriteStream('index.html'))
  .on('finish', () => {
    console.timeEnd('buildHtml')
    done && typeof done === 'function' && done();
  });
}

/**
 * Delete index.html
 * @return {promise}
 */
function cleanHtml() {
  console.time('cleanHtml');
  return trash(['index.html']).then(() => {
    console.timeEnd('cleanHtml');
  });
}

/**
 * Shortcut to clean and build index.html
 * @param  {Function} done called once index.html is written to disk
 */
function rebuildHtml(done) {
  cleanHtml().then(() => {
    buildHtml(done);
  });
}

/**
 * Rebuild index.html whenever any html file changes.
 */
function watchHtml() {
  console.log('watching html');
  gulp.watch(['src/**/*.html'], () => {
    rebuildHtml();
  })
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
}

gulp.task('html', function(done) {
  rebuildHtml(done);
});

gulp.task('html:clean', function(done) {
  cleanHtml().then(done);
});

gulp.task('html:watch', ['html'], function() {
  watchHtml();
});



/**
 * CSS
 */



/**
 * Generate index.css and its sourcemap.
 * @return {stream}
 */
function buildCss() {
  console.time('buildCss');
  return gulp.src('src/index.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'))
  .on('finish', () => {
    console.timeEnd('buildCss');
  });
}

/**
 * Delete index.css and its sourcemap.
 * @return {promise}
 */
function cleanCss() {
  console.time('cleanCss');
  return trash(['index-*.css', 'index-*.css.map']).then(() => {
    console.timeEnd('cleanCss');
  });
}

/**
 * Rebuild index.css and its sourcemap whenever any scss file changes.
 * Rebuild index.html to update index.css hash.
 */
function watchCss() {
  console.log('watching css');
  gulp.watch('src/**/*.scss', () => {
    cleanCss().then(() => {
      buildCss().on('finish', () => {
        rebuildHtml();
      });
    });
  })
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
}

gulp.task('css', function(done) {
  cleanCss().then(() => {
    buildCss().on('finish', () => {
      rebuildHtml(done);
    });
  });
});

gulp.task('css:clean', function(done) {
  cleanCss().then(done);
});

gulp.task('css:watch', ['css'], function() {
  watchCss();
});



/**
 * JS
 */



const js = {
  entries: ['src/index.ts'],
  output: 'index.js',
  destination: '.',
  pre: (done) => {
    console.time('buildJs (incremental)');
    cleanJs().then(done);
  },
  post: () => {
    console.timeEnd('buildJs (incremental)');
    rebuildHtml();
  }
};

/**
 * Generate main bundle and its sourcemap.
 * Hooks pre and post are not called on initial bundle.
 *
 * NOTE: When using watchify and tsify together, updating a typescript file in
 * one bundle triggers an update event in all bundles. Stick to one typescript
 * bundle until this is resolved.
 *
 * @param  {string[]} bundle.entries array of bundle entry files
 * @param  {string} bundle.output name of bundle file
 * @param  {string} bundle.destination directory containing bundle file
 * @param  {Function} bundle.pre pre-bundle hook
 * @param  {Function} bundle.post pose-bundle hook
 * @return {stream} browserifyBundleStream
 */
function buildJs(isWatchify) {
  console.time('buildJs');

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
    // b.on('log', console.log);
  }

  return rebundle(() => {
    console.timeEnd('buildJs');
  });
};

/**
 * Delete index.js file and its sourcemap.
 * @return {promise}
 */
function cleanJs() {
  console.time('cleanJs');
  return trash(['index-*.js', 'index-*.js.map']).then(() => {
    console.timeEnd('cleanJs');
  });
}

gulp.task('js', function(done) {
  cleanJs().then(() => {
    buildJs(false).on('finish', () => {
      rebuildHtml(done);
    });
  });
});

gulp.task('js:clean', function(done) {
  cleanJs().then(done);
});

gulp.task('js:watch', function(done) {
  cleanJs().then(() => {
    buildJs(true).on('finish', () => {
      rebuildHtml(done);
    });
  });
});



/**
 * VENDOR
 */



const vendor = {
  output: 'vendor.js',
  destination: '.'
};

/**
 * Generate vendor js files and their sourcemaps.
 * @return {stream} browserifyBundleStream
 */
function buildVendor() {
  console.time('buildVendor');

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
  .pipe(gulp.dest(vendor.destination))
  .on('finish', () => {
    console.timeEnd('buildVendor')
  });
};

/**
 * Delete vendor bundle and its sourcemap.
 * @return {promise}
 */
function cleanVendor() {
  console.time('cleanVendor');
  return trash(['vendor-*.js', 'vendor-*.js.map']).then(() => {
    console.timeEnd('cleanVendor');
  });
}

/**
 * Rebuild vendor bundle and its sourcemap whenever vendors.json changes.
 * Rebuild index.html to update file hash.
 */
function watchVendor() {
  console.log('watching vendor');
  gulp.watch('src/vendors.json', () => {
    cleanVendor().then(() => {
      buildVendor().on('finish', () => {
        rebuildHtml();
      });
    });
  })
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
}

gulp.task('vendor', function(done) {
  cleanVendor().then(() => {
    buildVendor().on('finish', () => {
      rebuildHtml(done);
    });
  });
});

gulp.task('vendor:clean', function(done) {
  cleanVendor().then(done);
});

gulp.task('vendor:watch', ['vendor'], function() {
  watchVendor();
});



/**
 * MAIN TASKS
 */



gulp.task('clean', function(done) {
  Promise.all([
    cleanHtml(),
    cleanCss(),
    cleanJs(),
    cleanVendor()
  ])
  .then(() => {
    done();
  });
});

gulp.task('build', ['clean'], function(done) {
  mergeStream([
    buildCss(),
    buildJs(false),
    buildVendor()
  ])
  .on('finish', function() {
    buildHtml(done);
  });
});

gulp.task('watch', ['clean'], (done) => {
  mergeStream([
    buildCss(),
    buildJs(true),// watch js
    buildVendor()
  ])
  .on('finish', function() {
    buildHtml(() => {
      watchCss();
      console.log('watching js');
      watchVendor();
      watchHtml();
    });
  });
});

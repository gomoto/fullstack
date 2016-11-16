const addSrc = require('gulp-add-src');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const fs = require('fs');
const gulp = require('gulp');
const htmlInjector = require('html-injector');
const htmlMinifierStream = require('html-minifier-stream');
const mergeStream = require('merge-stream');
const Promise = require('pinkie-promise');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const trash = require('trash');
const tsify = require('tsify');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const watchify = require('watchify');



const appPath = 'app';
const clientPath = 'client';
const serverPath = 'server';
const paths = {
  client: {
    htmlTemplates: `${clientPath}/src/modules/*.html`,
    htmlEntry: `${clientPath}/src/index.html`,
    htmlExit: `${appPath}/${clientPath}/index.html`,
    css: `${clientPath}/src/**/*.scss`,
    cssEntry: `${clientPath}/src/index.scss`,
    cssExit: `${appPath}/${clientPath}/index.css`,
    cssExitRevPattern: `${appPath}/${clientPath}/index-*.css`,
    jsEntry: `${clientPath}/src/index.ts`,
    jsExit: `${appPath}/${clientPath}/index.js`,
    jsExitRevPattern: `${appPath}/${clientPath}/index-*.js`,
    vendor: `${clientPath}/vendors.json`,
    vendorExit: `${appPath}/${clientPath}/vendor.js`,
    vendorExitRevPattern: `${appPath}/${clientPath}/vendor-*.js`,
    tsconfig: `${clientPath}/tsconfig.json`
  },
  server: {
    destination: `${appPath}/${serverPath}`,
    typescript: `${serverPath}/src/**/!(*.spec).ts`,
    typings: `${serverPath}/typings/**/*.d.ts`,
    html: `${serverPath}/src/**/*.html`,
    tsconfig: `${serverPath}/tsconfig.json`
  }
};



/**
 * Helpers
 */



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
  fs.createReadStream(paths.client.htmlEntry)
  .pipe(htmlInjector('templates', null, [paths.client.htmlTemplates]))
  .pipe(htmlInjector('css', null, [paths.client.cssExitRevPattern]))
  .pipe(htmlInjector('js', null, [paths.client.jsExitRevPattern]))
  .pipe(htmlMinifierStream({
    collapseWhitespace: true,
    processScripts: ['text/ng-template']
  }))
  .pipe(fs.createWriteStream(paths.client.htmlExit))
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
  return trash([paths.client.htmlExit]).then(() => {
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
  gulp.watch([
    paths.client.htmlTemplates,
    paths.client.htmlEntry
  ], () => {
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
  return gulp.src(paths.client.cssEntry)
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
  .pipe(rename(paths.client.cssExit))
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
  return trash([
    paths.client.cssExitRevPattern,
    `${paths.client.cssExitRevPattern}.map`
  ])
  .then(() => {
    console.timeEnd('cleanCss');
  });
}

/**
 * Rebuild index.css and its sourcemap whenever any scss file changes.
 * Rebuild index.html to update index.css hash.
 */
function watchCss() {
  console.log('watching css');
  gulp.watch(paths.client.css, () => {
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
 * JavaScript
 */



const prebundle = (done) => {
  console.time('buildJs (incremental)');
  cleanJs().then(done);
};

const postbundle = () => {
  console.timeEnd('buildJs (incremental)');
  rebuildHtml();
};

/**
 * Generate main bundle and its sourcemap.
 * Hooks pre and post are not called on initial bundle.
 *
 * NOTE: When using watchify and tsify together, updating a typescript file in
 * one bundle triggers an update event in all bundles. Stick to one typescript
 * bundle until this is resolved.
 *
 * @return {stream} browserifyBundleStream
 */
function buildJs(isWatchify) {
  console.time('buildJs');

  const browserifyOptions = {
    cache: {},
    packageCache: {},
    entries: [paths.client.jsEntry],
    debug: true
  };

  const b = browserify(browserifyOptions)
  .plugin(tsify, { project: paths.client.tsconfig });

  const rebundle = (callback) => {
    return b.bundle()
    .on('error', console.error)
    .pipe(source(paths.client.jsExit))
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
  };

  if (isWatchify) {
    b.plugin(watchify);
    b.on('update', (ids) => {
      console.log(ids);
      prebundle(() => {
        rebundle(postbundle);
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
  return trash([
    paths.client.jsExitRevPattern,
    `${paths.client.jsExitRevPattern}.map`
  ])
  .then(() => {
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
 * Vendor
 */



/**
 * Generate vendor js file and its sourcemap.
 * @return {stream} browserifyBundleStream
 */
function buildVendor() {
  console.time('buildVendor');

  const b = browserify({ debug: true });

  require(`./${paths.client.vendor}`).forEach((vendor) => {
    b.require(vendor);
  });

  return b.bundle()
  .on('error', console.error)
  .pipe(source(paths.client.vendorExit))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(uglify())
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'))
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
  return trash([
    paths.client.vendorExitRevPattern,
    `${paths.client.vendorExitRevPattern}.map`
  ])
  .then(() => {
    console.timeEnd('cleanVendor');
  });
}

/**
 * Rebuild vendor bundle and its sourcemap whenever vendors.json changes.
 * Rebuild index.html to update file hash.
 */
function watchVendor() {
  console.log('watching vendor');
  gulp.watch(paths.client.vendor, () => {
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
 * Client
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



/**
 * Server
 */



const serverTypescript = typescript.createProject(paths.server.tsconfig);

gulp.task('build:server', () => {
  return gulp.src([
    paths.server.typescript,
    paths.server.typings
  ])
  .pipe(serverTypescript())
  .pipe(addSrc(paths.server.html))
  .pipe(gulp.dest(paths.server.destination));
});

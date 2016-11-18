const addSrc = require('gulp-add-src');
const async = require('async');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const chalk = require('chalk');
const dotenv = require('dotenv');
const fs = require('fs');
const fsExtra = require('fs-extra');
const gulp = require('gulp');
const htmlInjector = require('html-injector');
const htmlMinifierStream = require('html-minifier-stream');
const mergeStream = require('merge-stream');
const nodemon = require('nodemon');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const trash = require('trash');
const tsify = require('tsify');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const waitOn = require('wait-on');
const watchify = require('watchify');

// load environment variables from .env
dotenv.config();

const noop = Function.prototype;

const names = {
  app: 'app',
  client: 'client',
  server: 'server'
};

const paths = {
  app: {
    directory: `${names.app}`,
    client: {
      directory: `${names.app}/${names.client}`,
      html: `${names.app}/${names.client}/index.html`,
      css: {
        raw: `${names.app}/${names.client}/index.css`,
        hashed: `${names.app}/${names.client}/index-*.css`
      },
      js: {
        raw: `${names.app}/${names.client}/index.js`,
        hashed: `${names.app}/${names.client}/index-*.js`
      },
      vendor: {
        raw: `${names.app}/${names.client}/vendor.js`,
        hashed: `${names.app}/${names.client}/vendor-*.js`
      },
      assets: `${names.app}/${names.client}/assets`
    },
    server: {
      directory: `${names.app}/${names.server}`
    }
  },
  client: {
    html: {
      templates: `${names.client}/src/modules/**/*.html`,
      entry: `${names.client}/src/index.html`
    },
    css: {
      source: `${names.client}/src/**/*.scss`,
      entry: `${names.client}/src/index.scss`
    },
    js: {
      entry: `${names.client}/src/index.ts`,
    },
    vendor: `${names.client}/vendors.json`,
    assets: `${names.client}/assets`,
    tsconfig: `${names.client}/tsconfig.json`
  },
  server: {
    typescript: `${names.server}/src/**/!(*.spec).ts`,
    typings: `${names.server}/typings/**/*.d.ts`,
    html: `${names.server}/src/**/*.html`,
    tsconfig: `${names.server}/tsconfig.json`
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
  done = done || noop;
  console.time('buildHtml');
  fs.createReadStream(paths.client.html.entry)
  .pipe(htmlInjector({
    templates: {
      globs: [paths.client.html.templates]
    },
    css: {
      globs: [paths.app.client.css.hashed],
      cwd: paths.app.client.directory
    },
    js: {
      globs: [
        paths.app.client.vendor.hashed,
        paths.app.client.js.hashed
      ],
      cwd: paths.app.client.directory
    }
  }))
  .pipe(htmlMinifierStream({
    collapseWhitespace: true,
    processScripts: ['text/ng-template']
  }))
  .pipe(fs.createWriteStream(paths.app.client.html))
  .on('finish', () => {
    console.timeEnd('buildHtml')
    done();
  });
}

/**
 * Delete index.html
 * @return {promise}
 */
function cleanHtml(done) {
  done = done || noop;
  console.time('cleanHtml');
  return trash([paths.app.client.html])
  .then(() => {
    console.timeEnd('cleanHtml');
    done();
  });
}

/**
 * Shortcut to clean and build index.html
 * @param  {Function} done called once index.html is written to disk
 */
function rebuildHtml(done) {
  cleanHtml(() => {
    buildHtml(done);
  });
}

/**
 * Rebuild index.html whenever any html file changes.
 */
function watchHtml(callback) {
  callback = callback || noop;
  console.log('watching html');
  gulp.watch([
    paths.client.html.templates,
    paths.client.html.entry
  ], () => {
    rebuildHtml(callback);
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
  cleanHtml(done);
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
function buildCss(done) {
  done = done || noop;
  console.time('buildCss');
  return gulp.src(paths.client.css.entry)
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
  .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
  .pipe(rename(paths.app.client.css.raw))
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'))
  .on('finish', () => {
    done();
    console.timeEnd('buildCss');
  });
}

/**
 * Delete index.css and its sourcemap.
 * @return {promise}
 */
function cleanCss(done) {
  done = done || noop;
  console.time('cleanCss');
  return trash([
    paths.app.client.css.hashed,
    `${paths.app.client.css.hashed}.map`
  ])
  .then(() => {
    console.timeEnd('cleanCss');
    done();
  });
}

/**
 * Rebuild index.css and its sourcemap whenever any scss file changes.
 * Rebuild index.html to update index.css hash.
 */
function watchCss(callback) {
  callback = callback || noop;
  console.log('watching css');
  gulp.watch(paths.client.css.source, () => {
    cleanCss(() => {
      buildCss(() => {
        rebuildHtml(callback);
      });
    });
  })
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
}

gulp.task('css', function(done) {
  cleanCss(() => {
    buildCss(() => {
      rebuildHtml(done);
    });
  });
});

gulp.task('css:clean', function(done) {
  cleanCss(done);
});

gulp.task('css:watch', ['css'], function() {
  watchCss();
});



/**
 * JavaScript
 */

/**
 * Generate main bundle and its sourcemap.
 *
 * NOTE: When using watchify and tsify together, updating a typescript file in
 * one bundle triggers an update event in all bundles. Stick to one typescript
 * bundle until this is resolved.
 *
 * @param  {Function} done called after js files have been written to disk
 * @param  {boolean} watchMode should watchify plugin be used?
 * @param  {Function} watchCallback called, with the bundle function as its only argument, whenever watchify detects a change in files
 * @return {stream} browserifyBundleStream
 */
function _buildJs(done, watchMode, watchCallback) {
  done = done || noop;
  console.time('buildJs');

  const browserifyOptions = {
    cache: {},
    packageCache: {},
    entries: [paths.client.js.entry],
    debug: true
  };

  const b = browserify(browserifyOptions)
  .plugin(tsify, { project: paths.client.tsconfig });

  /**
   * Bundle js files.
   * @param  {Function} callback called after bundle is written to disk
   * @return {stream} browserifyBundleStream
   */
  const bundle = (callback) => {
    callback = callback || noop;
    return b.bundle()
    .on('error', console.error)
    .pipe(source(paths.app.client.js.raw))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'))
    .on('finish', function() {
      callback();
    });
  };

  if (watchMode) {
    watchCallback = watchCallback || noop;
    b.plugin(watchify)
    b.on('update', (ids) => {
      console.log(ids);
      watchCallback(bundle);
    });
  }

  return bundle(() => {
    console.timeEnd('buildJs');
    done();
  });
}

/**
 * Generate index.js and its sourcemap.
 * @param  {Function} done called after files are written to disk
 * @return {stream} browserifyBundleStream
 */
function buildJs(done) {
  return _buildJs(done);
}

/**
 * Rebuild index.js and its sourcemap whenever any typescript file changes.
 * Rebuild index.html to update index.js hash.
 * NOTE: Because of how watchify and browserify work together, this function
 * builds the bundle one time, unlike other watch functions.
 * @param  {Function} buildDone called after the first bundle is written to disk
 * @param  {Function} watchCallback called after each subsequent bundle is written to disk
 * @return {stream} browserifyBundleStream for the first bundle
 */
function buildAndWatchJs(buildDone, watchCallback) {
  buildDone = buildDone || noop;
  watchCallback = watchCallback || noop;
  return _buildJs(buildDone, true, (bundle) => {
    cleanJs(() => {
      console.time('buildJs (incremental)');
      bundle(() => {
        console.timeEnd('buildJs (incremental)');
        rebuildHtml(() => {
          watchCallback();
        });
      });
    });
  });
}

/**
 * Delete index.js file and its sourcemap.
 * @return {promise}
 */
function cleanJs(done) {
  done = done || noop;
  console.time('cleanJs');
  return trash([
    paths.app.client.js.hashed,
    `${paths.app.client.js.hashed}.map`
  ])
  .then(() => {
    console.timeEnd('cleanJs');
    done();
  });
}

gulp.task('js', function(done) {
  cleanJs(() => {
    buildJs(() => {
      rebuildHtml(done);
    });
  });
});

gulp.task('js:clean', function(done) {
  cleanJs(done);
});

gulp.task('js:watch', function(done) {
  buildAndWatchJs(done);
});



/**
 * Vendor
 */



/**
 * Generate vendor js file and its sourcemap.
 * @return {stream} browserifyBundleStream
 */
function buildVendor(done) {
  done = done || noop;
  console.time('buildVendor');

  const b = browserify({ debug: true });

  require(`./${paths.client.vendor}`).forEach((vendor) => {
    b.require(vendor);
  });

  return b.bundle()
  .on('error', console.error)
  .pipe(source(paths.app.client.vendor.raw))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(uglify())
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'))
  .on('finish', () => {
    console.timeEnd('buildVendor');
    done();
  });
};

/**
 * Delete vendor bundle and its sourcemap.
 * @return {promise}
 */
function cleanVendor(done) {
  done = done || noop;
  console.time('cleanVendor');
  return trash([
    paths.app.client.vendor.hashed,
    `${paths.app.client.vendor.hashed}.map`
  ])
  .then(() => {
    console.timeEnd('cleanVendor');
    done();
  });
}

/**
 * Rebuild vendor bundle and its sourcemap whenever vendors.json changes.
 * Rebuild index.html to update file hash.
 */
function watchVendor(callback) {
  callback = callback || noop;
  console.log('watching vendor');
  gulp.watch(paths.client.vendor, () => {
    cleanVendor(() => {
      buildVendor(() => {
        rebuildHtml(callback);
      });
    });
  })
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
}

gulp.task('vendor', function(done) {
  cleanVendor(() => {
    buildVendor(() => {
      rebuildHtml(done);
    });
  });
});

gulp.task('vendor:clean', function(done) {
  cleanVendor(done);
});

gulp.task('vendor:watch', ['vendor'], function() {
  watchVendor();
});



/**
 * Copy
 */



function copyAssets() {
  console.time('copyAssets');
  fsExtra.copy(paths.client.assets, paths.app.client.assets, (err) => {
    if (err) console.error('Error copying assets!');
    console.timeEnd('copyAssets');
  });
}



/**
 * Client
 */



/**
 * Helper function to build and watch client files.
 * @param  {Function} done called after all client files are written to disk the first time
 * @param  {boolean} watchMode should set up client watch functions?
 * @param  {Function} watchCallback passed to each client watch function
 */
function _buildClient(done, watchMode, watchCallback) {
  done = done || noop;
  watchCallback = watchCallback || noop;
  copyAssets();//race condition!
  mergeStream([
    buildCss(),
    watchMode ? buildAndWatchJs(null, watchCallback) : buildJs(),
    buildVendor()
  ])
  .on('finish', function() {
    buildHtml(() => {
      done();
      if (watchMode) {
        // watch client files
        watchCss(watchCallback);
        console.log('watching js');
        watchVendor(watchCallback);
        watchHtml(watchCallback);
      }
    });
  });
}

/**
 * Build client files.
 * @param {Function} done called after all client files are written to disk
 */
function buildClient(done) {
  _buildClient(done);
}

/**
 * Set up watch tasks for client modules (html, css, js).
 * NOTE: Because of buildAndWatchJs(), this function also builds the bundle one
 * time, unlike other watch functions.
 * @param  {Function} buildDone called after all client files are written to disk the first time
 * @param  {Function} watchCallback passed to each client watch function
 */
function buildAndWatchClient(buildDone, watchCallback) {
  _buildClient(buildDone, true, watchCallback);
}

/**
 * Clean client files.
 * @param {Function} done
 */
function cleanClient(done) {
  fsExtra.remove(paths.app.client.directory, done);
}

/**
 * Shortcut to clean and build client files.
 * @param  {Function} done called once client files are written to disk
 */
function rebuildClient(done) {
  cleanClient(() => {
    buildClient(done);
  });
}

gulp.task('clean:client', function(done) {
  cleanClient(done);
});

gulp.task('build:client', function(done) {
  rebuildClient(done);
});



/**
 * Server
 */



const serverTypescript = typescript.createProject(paths.server.tsconfig);

/**
 * Build server files.
 * @param {Function} done
 * @return {stream}
 */
function buildServer(done) {
  done = done || noop;
  console.time('buildServer');
  return gulp.src([
    paths.server.typescript,
    paths.server.typings
  ])
  .pipe(serverTypescript())
  .pipe(addSrc(paths.server.html))
  .pipe(gulp.dest(paths.app.server.directory))
  .on('finish', () => {
    console.timeEnd('buildServer');
    done();
  });
}

/**
 * Watch server files.
 * @param  {Function} watchCallback called whenever a server file changes
 */
function watchServer(watchCallback) {
  gulp.watch([
    paths.server.typescript,
    paths.server.typings
  ], () => {
    watchCallback();
  })
  .on('change', logWatchEvent)
  .on('add', logWatchEvent)
  .on('delete', logWatchEvent)
  .on('rename', logWatchEvent);
}

/**
 * Clean server files.
 * @param {Function} done
 */
function cleanServer(done) {
  fsExtra.remove(paths.app.server.directory, done);
}

/**
 * Shortcut to clean and build server files.
 * @param  {Function} done called once server files are written to disk
 */
function rebuildServer(done) {
  cleanServer(() => {
    buildServer(done);
  });
}

gulp.task('clean:server', (done) => {
  cleanServer(done);
});

gulp.task('build:server', (done) => {
  rebuildServer(done);
});



/**
 * App
 */

gulp.task('clean', (done) => {
  fsExtra.remove(paths.app.directory, done);
});

gulp.task('build', ['build:client', 'build:server']);

gulp.task('serve', (done) => {
  const host = `http://${process.env.IP}:${process.env.PORT}`;
  const browserSyncServer = browserSync.create();
  const waitOptions = {
    resources: [host],
    interval: 100
  };

  // (1) Build and watch client and server files
  const clientTask = (callback) => {
    buildAndWatchClient(callback, browserSyncServer.reload);
  };
  const serverTask = (callback) => {
    rebuildServer(() => {
      watchServer(() => {
        rebuildServer(() => {
          nodemon.emit('restart');
        });
      });
      callback();
    });
  };
  async.parallel([clientTask, serverTask], () => {
    // (2) Launch server
    nodemon(`-w .env ${paths.app.server.directory}/app.js`)
    .on('log', (log) => {
      logNodemon(log.message);
    })
    .on('restart', (files) => {
      logNodemon(`restarted`);

      // reload browser-sync proxy server once app server is ready
      waitOn(waitOptions, (err) => {
        if (err) console.error(err);
        browserSyncServer.reload();
      });
    })
    .on('crash', () => logNodemon('crashed'))
    .on('exit', () => logNodemon('exited'))
    .on('quit', () => logNodemon('quit'));

    // (3) Launch browser-sync proxy server once app server is ready
    waitOn(waitOptions, (err) => {
      if (err) console.error(err);
      browserSyncServer.init({
        proxy: host,
        browser: 'google chrome',
        port: 7000
      });
    });
  });
});

function logNodemon(message) {
  console.log(chalk.yellow('[nodemon]'), message);
}

// gulp.watch('gulpfile.js', () => {
//   console.log(chalk.red('gulpfile changed'));
//   process.exit();
// });

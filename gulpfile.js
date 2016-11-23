const addSrc = require('gulp-add-src');
const async = require('async');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const browserify = require('browserify-incremental');
const buffer = require('vinyl-buffer');
const chalk = require('chalk');
const envify = require('envify/custom');
const fs = require('fs');
const fsExtra = require('fs-extra');
const gulp = require('gulp');
const htmlInjector = require('html-injector');
const htmlMinifierStream = require('html-minifier-stream');
const imagemin = require('gulp-imagemin');
const ini = require('ini');
const mergeStream = require('merge-stream');
const nodemon = require('nodemon');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const trash = require('trash');
const tsify = require('tsify');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const waitOn = require('wait-on');

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
      assets: {
        directory: `${names.app}/${names.client}/assets`,
        images: {
          directory: `${names.app}/${names.client}/assets/images`,
          manifest: `${names.app}/${names.client}/assets/images/manifest.json`,
        }
      },
    },
    server: {
      directory: `${names.app}/${names.server}`
    }
  },
  client: {
    html: {
      templates: `${names.client}/src/*/**/*.html`,
      entry: `${names.client}/src/index.html`
    },
    css: {
      source: `${names.client}/src/**/*.scss`,
      entry: `${names.client}/src/index.scss`
    },
    js: {
      source: `${names.client}/src/**/*.ts`,
      entry: `${names.client}/src/index.ts`
    },
    vendor: `${names.client}/vendors.json`,
    assets: {
      directory: `${names.client}/assets`,
      images: `${names.client}/assets/images/**/*`
    },
    tsconfig: `${names.client}/tsconfig.json`
  },
  server: {
    typescript: `${names.server}/src/**/!(*.spec).ts`,
    html: `${names.server}/src/**/*.html`,
    tsconfig: `${names.server}/tsconfig.json`
  },
  env: '.env'
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
  timeClient('html build');
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
  .pipe(source(paths.app.client.html))
  .pipe(buffer())
  .pipe(revReplace({
    manifest: gulp.src(paths.app.client.assets.images.manifest)
  }))
  .pipe(gulp.dest('.'))
  .on('finish', () => {
    timeEndClient('html build');
    done();
  });
}

/**
 * Delete index.html
 * @return {promise}
 */
function cleanHtml(done) {
  done = done || noop;
  timeClient('html clean');
  return trash([paths.app.client.html])
  .then(() => {
    timeEndClient('html clean');
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
 * @param  {Function} callback called after index.html is written to disk
 */
function watchHtml(callback) {
  callback = callback || noop;
  logClient('watching html');
  gulp.watch([
    paths.client.html.templates,
    paths.client.html.entry
  ], (event) => {
    logClientWatchEvent(event);
    rebuildHtml(callback);
  });
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
  timeClient('css build');
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
    timeEndClient('css build');
  });
}

/**
 * Delete index.css and its sourcemap.
 * @return {promise}
 */
function cleanCss(done) {
  done = done || noop;
  timeClient('css clean');
  return trash([
    paths.app.client.css.hashed,
    `${paths.app.client.css.hashed}.map`
  ])
  .then(() => {
    timeEndClient('css clean');
    done();
  });
}

/**
 * Rebuild index.css and its sourcemap whenever any scss file changes.
 * Rebuild index.html to update index.css hash.
 * @param  {Function} callback called after files are written to disk
 */
function watchCss(callback) {
  callback = callback || noop;
  logClient('watching css');
  gulp.watch(paths.client.css.source, (event) => {
    logClientWatchEvent(event);
    cleanCss(() => {
      buildCss(() => {
        rebuildHtml(callback);
      });
    });
  });
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
 * NOTE: watchify doesn't trigger update event when files are added, or when
 * those newly added files are saved!
 * NOTE: When using watchify and tsify together, updating a typescript file in
 * one bundle triggers an update event in all bundles. Stick to one typescript
 * bundle until this is resolved.
 * NOTE: This might be fixed with gulp.watch (watchify was removed).
 */

/**
 * Browserify instance for the index.js bundle.
 */
var jsBundle;

/**
 * Bundle js files.
 * @param  {Function} done called after bundle is written to disk
 * @return {stream} browserifyBundleStream
 */
function bundleJs(done) {
  done = done || noop;
  if (!jsBundle) {
    console.error('buildJs() must be called at least once before this point');
    process.exit();
  }
  return jsBundle.bundle()
  .on('error', console.error)
  .pipe(source(paths.app.client.js.raw))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(uglify())
  .pipe(rev())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'))
  .on('finish', function() {
    done();
  });
}

/**
 * Generate index.js and its sourcemap.
 * @param  {Function} done called after files are written to disk
 * @return {stream} browserifyBundleStream
 */
function buildJs(done) {
  done = done || noop;
  timeClient('js build');
  const env = getEnv();
  const browserifyOptions = {
    cache: {},
    packageCache: {},
    entries: [paths.client.js.entry],
    debug: true
  };

  jsBundle = browserify(browserifyOptions);

  // transpile TypeScript
  jsBundle.plugin(tsify, { project: paths.client.tsconfig });

  // replace environment variables
  jsBundle.transform(envify({
    _: 'purge',
    NODE_ENV: env.NODE_ENV,
    LOGIN_URI: env.LOGIN_URI
  }));

  require(`./${paths.client.vendor}`).forEach((vendor) => {
    jsBundle.external(vendor);
  });

  return bundleJs(() => {
    timeEndClient('js build');
    done();
  });
}

/**
 * Rebuild index.js and its sourcemap whenever any typescript file changes.
 * Rebuild index.html to update index.js hash.
 * NOTE: buildJs must be called at least once before this.
 * @param  {Function} callback called after bundle is written to disk
 */
function watchJs(callback) {
  callback = callback || noop;
  logClient('watching js');
  gulp.watch(paths.client.js.source, (event) => {
    logClientWatchEvent(event);
    cleanJs(() => {
      timeClient('js build (incremental)');
      bundleJs(() => {
        timeEndClient('js build (incremental)');
        rebuildHtml(callback);
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
  timeClient('js clean');
  return trash([
    paths.app.client.js.hashed,
    `${paths.app.client.js.hashed}.map`
  ])
  .then(() => {
    timeEndClient('js clean');
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

gulp.task('js:watch', ['js'], function() {
  watchJs();
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
  timeClient('vendor build');

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
    timeEndClient('vendor build');
    done();
  });
};

/**
 * Delete vendor bundle and its sourcemap.
 * @return {promise}
 */
function cleanVendor(done) {
  done = done || noop;
  timeClient('vendor clean');
  return trash([
    paths.app.client.vendor.hashed,
    `${paths.app.client.vendor.hashed}.map`
  ])
  .then(() => {
    timeEndClient('vendor clean');
    done();
  });
}

/**
 * Rebuild vendor bundle and its sourcemap whenever vendors.json changes.
 * Rebuild index.html to update file hash.
 * @param  {Function} callback called after files are written to disk
 */
function watchVendor(callback) {
  callback = callback || noop;
  logClient('watching vendor');
  gulp.watch(paths.client.vendor, (event) => {
    logClientWatchEvent(event);
    cleanVendor(() => {
      buildVendor(() => {
        rebuildHtml(callback);
      });
    });
  });
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
 * Assets
 */



/**
 * Minify and revision image files.
 * @return {stream}
 */
function buildImages(done) {
  done = done || noop;
  timeClient('images build');
  return gulp.src(paths.client.assets.images)
  .pipe(imagemin())
  .pipe(rev())
  .pipe(gulp.dest(paths.app.client.assets.images.directory))
  .pipe(rev.manifest(paths.app.client.assets.images.manifest))
  .pipe(gulp.dest('.'))
  .on('finish', () => {
    timeEndClient('images build');
    done();
  });
}

/**
 * Delete image files.
 * @param  {Function} done
 * @return {promise}
 */
function cleanImages(done) {
  done = done || noop;
  timeClient('images clean');
  return trash([paths.app.client.assets.images.directory])
  .then(() => {
    timeEndClient('images clean');
    done();
  });
}

/**
 * Rebuild images whenever images change.
 * Rebuild index.html to update file hashes.
 * @param  {Function} callback called after files are written to disk
 */
function watchImages(callback) {
  callback = callback || noop;
  logClient('watching images');
  gulp.watch(paths.client.assets.images, (event) => {
    logClientWatchEvent(event);
    cleanImages(() => {
      buildImages(() => {
        rebuildHtml(callback);
      });
    });
  });
}

gulp.task('images', (done) => {
  cleanImages(() => {
    buildImages(() => {
      rebuildHtml(done);
    });
  });
});

gulp.task('images:watch', ['images'], () => {
  watchImages();
});



/**
 * Environment
 */

/**
 * When environment variables change, rebuild js bundle from scratch.
 * @param  {Function} callback called after bundle is written to disk
 */
function watchEnvironment(callback) {
  callback = callback || noop;
  gulp.watch(paths.env, (event) => {
    logEnvironmentWatchEvent(event);
    cleanJs(() => {
      buildJs(() => {
        rebuildHtml(callback);
      });
    });
  });
}

/**
 * Return environment variables as an object, without loading them into process.env
 * @return {Object} environmentVariables
 */
function getEnv() {
  return ini.parse(fs.readFileSync(paths.env, 'utf-8'));
}



/**
 * Client
 */

/**
 * Build client files.
 * @param {Function} done called after all client files are written to disk
 */
function buildClient(done) {
  done = done || noop;
  timeClient('build');
  mergeStream([
    buildCss(),
    buildJs(),
    buildVendor(),
    buildImages()
  ])
  .on('finish', function() {
    buildHtml(() => {
      timeEndClient('build');
      done();
    });
  });
}

/**
 * Watch each build cycle independently.
 * @param  {Function} callback passed to each client watch function
 */
function watchClient(callback) {
  callback = callback || noop;
  watchCss(callback);
  watchJs(callback);
  watchVendor(callback);
  watchImages(callback);
  watchHtml(callback);
  watchEnvironment(callback);
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
  timeServer('build');
  return gulp.src(paths.server.typescript)
  .pipe(serverTypescript())
  .pipe(addSrc(paths.server.html))
  .pipe(gulp.dest(paths.app.server.directory))
  .on('finish', () => {
    timeEndServer('build');
    done();
  });
}

/**
 * Watch server files.
 * @param  {Function} callback called whenever a server file changes
 */
function watchServer(callback) {
  callback = callback || noop;
  gulp.watch(paths.server.typescript, (event) => {
    logServerWatchEvent(event);
    rebuildServer(callback);
  });
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

// If we use gulp subtasks, the time report for this task is not useful.
gulp.task('build', ['clean'], (done) => {
  async.parallel([rebuildClient, rebuildServer], done);
});

gulp.task('serve', ['clean'], (done) => {
  const env = getEnv();
  const host = `http://${env.IP}:${env.PORT}`;
  const browserSyncServer = browserSync.create();
  const waitOptions = {
    resources: [host],
    interval: 100
  };

  // (1) Build and watch client and server files

  const clientTask = (callback) => {
    buildClient(() => {
      watchClient(() => {
        browserSyncServer.reload();
      });
      callback();
    });
  };

  const serverTask = (callback) => {
    buildServer(() => {
      watchServer(() => {
        nodemon.emit('restart');
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



/**
 * Loggers
 */



// Client

const clientLogPrefix = chalk.cyan('[client]');

function logClient(message) {
  console.log(clientLogPrefix, message);
}

function logClientWatchEvent(event) {
  logClient(`${event.path} ${event.type}`);
}

function timeClient(key) {
  console.time(`${clientLogPrefix} ${key}`);
}

function timeEndClient(key) {
  console.timeEnd(`${clientLogPrefix} ${key}`);
}

// Server

const serverLogPrefix = chalk.yellow('[server]');

function logServer(message) {
  console.log(serverLogPrefix, message);
}

function logServerWatchEvent(event) {
  logServer(`${event.path} ${event.type}`);
}

function timeServer(key) {
  console.time(`${serverLogPrefix} ${key}`);
}

function timeEndServer(key) {
  console.timeEnd(`${serverLogPrefix} ${key}`);
}

// Nodemon

const nodemonLogPrefix = chalk.yellow('[nodemon]');

function logNodemon(message) {
  console.log(nodemonLogPrefix, message);
}

// Environment

const environmentLogPrefix = chalk.green('[env]');

function logEnvironment(message) {
  console.log(environmentLogPrefix, message);
}

function logEnvironmentWatchEvent(event) {
  logEnvironment(`${event.path} ${event.type}`);
}



// gulp.watch('gulpfile.js', () => {
//   console.log(chalk.red('gulpfile changed'));
//   process.exit();
// });



// TODO: test tasks

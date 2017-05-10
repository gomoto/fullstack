const chokidar = require('chokidar')
const livereload = require('gulp-livereload')
const ido = {
  file: require('ido/file'),
  html: require('ido/html'),
  image: require('ido/image'),
  scss: require('ido/scss'),
  process: require('ido/process'),
  typescript: require('ido/typescript'),
  vendor: require('ido/npm')
}

module.exports = function watch(config) {
  livereload.listen()

  /**
   * Client
   */
  _watch(config.client.scss.watch, () => {
    return ido.scss.bundle(config.client.scss.entry, config.client.scss.bundle, config.client.scss.options)
    .then(() => {
      livereload.changed(config.client.scss.livereload)
    })
  })
  _watch(config.client.typescript.watch, (done) => {
    return ido.typescript.bundle(config.client.typescript.entry, config.client.typescript.bundle, config.client.typescript.options)
    .then(() => {
      livereload.changed(config.client.typescript.livereload)
    })
  })
  _watch(config.client.vendor.watch, () => {
    return ido.vendor.bundle(config.client.vendor.entry, config.client.vendor.bundle, config.client.vendor.options)
    .then(() => {
      livereload.changed(config.client.vendor.livereload)
    })
  })
  _watch(config.client.html.watch, () => {
    return ido.html.bundle(config.client.html.entry, config.client.html.bundle, config.client.html.options)
    .then(() => {
      livereload.changed(config.client.html.livereload)
    })
  })
  _watch(config.client.globals.watch, () => {
    return ido.html.bundle(config.client.html.entry, config.client.html.bundle, config.client.html.options)
    .then(() => {
      livereload.changed(config.client.html.livereload)
    })
  })

  /**
   * Resources
   */
  _watch(config.resources.images.watch, () => {
    return ido.file.remove(config.resources.images.destDir)
    .then(() => {
      return ido.image.copy(config.resources.images.srcGlob, config.resources.images.destDir, config.resources.images.options)
    })
    .then(() => {
      livereload.changed(config.client.html.livereload)
    })
  })

  /**
   * Server
   */
  _watch(config.server.typescript.watch, () => {
    return ido.file.remove(`${config.server.typescript.destDir}/**/*.js`)
    .then(() => {
      return ido.typescript.transpile(config.server.typescript.srcGlob, config.server.typescript.destDir, config.server.typescript.options)
    })
    .then(() => {
      _restartAppContainer()
    })
  })
  _watch(config.server.html.watch, () => {
    return ido.file.remove(`${config.server.html.destDir}/**/*.html`)
    .then(() => {
      return ido.file.copy(config.server.html.srcGlob, config.server.html.destDir)
    })
    .then(() => {
      _restartAppContainer()
    })
  })

  return _startAppContainer().then(() => {
    // Gracefully remove app container on ctrl-c signal.
    process.on('SIGINT', () => {
      _removeAppContainer().then(() => {
        process.exit(0)
      })
    })
    _followLogs()
  })
}

/**
 * Watch files matching given glob.
 * @param {string} glob
 * @param {() => Promise} callback
 */
function _watch(glob, callback) {
  chokidar.watch(glob, {ignoreInitial: true}).on('all', (event, path) => {
    const key = `[${event}] ${path}`
    console.log(key)
    console.time(key)
    callback().then(() => {
      console.timeEnd(key)
    })
  })
}

/**
 * Up app container and linked containers.
 * @return {Promise}
 */
function _startAppContainer() {
  // TODO: Only pull app container and its links
  return ido.process.spawn('docker-compose pull').then(() => {
    return ido.process.spawn('docker-compose up -d app')
  })
}

/**
 * Restart app container. Linked containers are not affected.
 * @return {Promise}
 */
function _restartAppContainer() {
  _removeAppContainer().then(() => {
    return ido.process.spawn('docker-compose create app')
  }).then(() => {
    return ido.process.spawn('docker-compose start app')
  }).then(() => {
    // Intentionally not returning this promise.
    _followLogs()
  })
}

/**
 * Remove app container. Linked containers are not affected.
 * If logs are being followed, this will cause them to stop being followed.
 * @return {Promise}
 */
function _removeAppContainer(callback) {
  return ido.process.spawn('docker-compose stop --timeout 0 app').then(() => {
    return ido.process.spawn('docker-compose rm --force app')
  })
}

/**
 * Follow app container logs. Exclude the returned promise from a promise chain
 * when you don't want to wait for the logs process to exit.
 * @return {Promise}
 */
function _followLogs() {
  return ido.process.spawn('docker-compose logs --follow --timestamps app')
  .catch((code) => {
    console.error(`Logs exiting with code ${code}`)
  })
}

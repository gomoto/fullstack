const chokidar = require('chokidar')
const rimraf = require('rimraf')
const shelljs = require('shelljs')
const ido = {
  file: require('ido/file'),
  html: require('ido/html'),
  image: require('ido/image'),
  scss: require('ido/scss'),
  typescript: require('ido/typescript'),
  vendor: require('ido/npm')
}

module.exports = function watch(config) {
  /**
   * Client
   */
  _watch(config.client.scss.watch, () => {
    return ido.scss.bundle(config.client.scss.entry, config.client.scss.bundle, config.client.scss.options)
  })
  _watch(config.client.typescript.watch, (done) => {
    return ido.typescript.bundle(config.client.typescript.entry, config.client.typescript.bundle, config.client.typescript.options)
  })
  _watch(config.client.vendor.watch, () => {
    return ido.vendor.bundle(config.client.vendor.entry, config.client.vendor.bundle, config.client.vendor.options)
  })
  _watch(config.client.html.watch, () => {
    return ido.html.bundle(config.client.html.entry, config.client.html.bundle, config.client.html.options)
  })
  _watch(config.client.globals.watch, () => {
    return ido.html.bundle(config.client.html.entry, config.client.html.bundle, config.client.html.options)
  })

  /**
   * Resources
   */
  _watch(config.resources.images.watch, () => {
    return _remove(config.resources.images.destDir)
    .then(() => {
      return ido.image.copy(config.resources.images.srcGlob, config.resources.images.destDir, config.resources.images.options)
    })
  })

  /**
   * Server
   */
  _watch(config.server.typescript.watch, () => {
    return _remove(`${config.server.typescript.destDir}/**/*.js`)
    .then(() => {
      return ido.typescript.transpile(config.server.typescript.srcGlob, config.server.typescript.destDir, config.server.typescript.options)
    })
    .then(() => {
      _restartAppContainer()
    })
  })
  _watch(config.server.html.watch, () => {
    return _remove(`${config.server.html.destDir}/**/*.html`)
    .then(() => {
      return ido.file.copy(config.server.html.srcGlob, config.server.html.destDir)
    })
    .then(() => {
      _restartAppContainer()
    })
  })

  _startAppContainer(() => {
    _followLogs()
  })

  process.on('SIGINT', () => {
    _removeAppContainer(() => {
      process.exit(0)
    })
  })

  return Promise.resolve()
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
 * Remove files matching given glob and return a promise.
 * @param {string} glob
 * @return {Promise}
 */
function _remove(glob) {
  return new Promise((resolve, reject) => {
    rimraf(glob, (error) => {
      error ? reject(error) : resolve()
    })
  })
}

/**
 * Up app container and linked containers.
 */
function _startAppContainer(callback) {
  shelljs.exec('docker-compose up -d app', () => {
    callback()
  })
}

/**
 * Restart app container. Linked containers are not affected.
 */
function _restartAppContainer() {
  _removeAppContainer(() => {
    shelljs.exec('docker-compose create app', () => {
      shelljs.exec('docker-compose start app', () => {
        _followLogs()
      })
    })
  })
}

/**
 * Remove app container. Linked containers are not affected.
 * If logs are being followed, this will cause them to stop being followed.
 */
function _removeAppContainer(callback) {
  shelljs.exec('docker-compose stop --timeout 0 app', () => {
    shelljs.exec('docker-compose rm --force app', () => {
      callback()
    })
  })
}

function _followLogs() {
  shelljs.exec('docker-compose logs --follow --timestamps app', { async: true })
}

const chokidar = require('chokidar')
const shelljs = require('shelljs')
const ido = {
  file: require('ido/file'),
  html: require('ido/html'),
  image: require('ido/image'),
  scss: require('ido/scss'),
  typescript: require('ido/typescript'),
  vendor: require('ido/npm')
}

function _watch(glob, callback) {
  chokidar.watch(glob, {ignoreInitial: true}).on('all', (event, path) => {
    console.log(`[${event}] ${path}`)
    callback()
  })
}

module.exports = function watch(config) {
  /**
   * Client
   */
  _watch(config.client.scss.watch, () => {
    ido.scss.bundle(config.client.scss.entry, config.client.scss.bundle, config.client.scss.options)
  })
  _watch(config.client.typescript.watch, () => {
    ido.typescript.bundle(config.client.typescript.entry, config.client.typescript.bundle, config.client.typescript.options)
  })
  _watch(config.client.vendor.watch, () => {
    ido.vendor.bundle(config.client.vendor.entry, config.client.vendor.bundle, config.client.vendor.options)
  })
  _watch(config.client.html.watch, () => {
    ido.html.bundle(config.client.html.entry, config.client.html.bundle, config.client.html.options)
  })
  _watch(config.client.globals.watch, () => {
    ido.html.bundle(config.client.html.entry, config.client.html.bundle, config.client.html.options)
  })
  _watch(config.resources.images.watch, () => {
    ido.image.copy(config.resources.images.srcGlob, config.resources.images.destDir, config.resources.images.options)
  })

  /**
   * Server
   */
  _watch(config.server.typescript.watch, () => {
    ido.typescript.transpile(config.server.typescript.srcGlob, config.server.typescript.destDir, config.server.typescript.options)
    .then(() => {
      shelljs.exec('echo TODO: restart server')
    })
  })
  _watch(config.server.html.watch, () => {
    ido.file.copy(config.server.html.srcGlob, config.server.html.destDir)
    .then(() => {
      shelljs.exec('echo TODO: restart server')
    })
  })

  return Promise.resolve()
}

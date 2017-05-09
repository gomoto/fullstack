const fs = require('fs')
const ido = {
  file: require('ido/file'),
  html: require('ido/html'),
  image: require('ido/image'),
  scss: require('ido/scss'),
  typescript: require('ido/typescript'),
  vendor: require('ido/npm')
}

const buildPrefix = '[build]'

module.exports = function build(config) {
  /**
   * Client
   */
  const client = Promise.all([
    ido.scss.bundle(config.client.scss.entry, config.client.scss.bundle, config.client.scss.options),
    ido.typescript.bundle(config.client.typescript.entry, config.client.typescript.bundle, config.client.typescript.options),
    ido.vendor.bundle(config.client.vendor.entry, config.client.vendor.bundle, config.client.vendor.options),
    ido.image.copy(config.resources.images.srcGlob, config.resources.images.destDir, config.resources.images.options)
  ])
  .then((manifests) => {
    const htmlOptions = Object.assign({}, config.client.html.options, { manifests })
    return ido.html.bundle(config.client.html.entry, config.client.html.bundle, htmlOptions)
  })
  .then(() => {
    console.log(`${buildPrefix} client is done`)
  })
  .catch((error) => {
    console.log(`${buildPrefix} client error`, error.stack)
    return Promise.reject(error)
  })

  /**
   * Server
   */
  const server = Promise.all([
    ido.typescript.transpile(config.server.typescript.srcGlob, config.server.typescript.destDir, config.server.typescript.options),
    ido.file.copy(config.server.html.srcGlob, config.server.html.destDir)
  ])
  .then(() => {
    console.log(`${buildPrefix} server is done`)
  })
  .catch((error) => {
    console.log(`${buildPrefix} server error`, error.stack)
    return Promise.reject(error)
  })

  return Promise.all([client, server])
}

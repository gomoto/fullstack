const fs = require('fs')
const file = require('ido/file')
const html = require('ido/html')
const image = require('ido/image')
const scss = require('ido/scss')
const typescript = require('ido/typescript')
const vendor = require('ido/npm')

const config = require('./build.config')

/**
 * Client
 */
Promise.all([
  scss.bundle(config.client.scss.entry, config.client.scss.bundle, config.client.scss.options),
  typescript.bundle(config.client.typescript.entry, config.client.typescript.bundle, config.client.typescript.options),
  vendor.bundle(config.client.vendor.entry, config.client.vendor.bundle, config.client.vendor.options),
  image.copy(config.resources.images.srcGlob, config.resources.images.destDir, config.resources.images.options),
  image.copy(config.resources.favicon.srcGlob, config.resources.favicon.destDir, config.resources.favicon.options)
])
.then((manifests) => {
  const htmlOptions = Object.assign({}, config.client.html.options, { manifests })
  return html.bundle(config.client.html.entry, config.client.html.bundle, htmlOptions)
})
.then(() => {
  console.log('client is done')
})
.catch((error) => {
  console.log('client error', error, error.stack)
})

/**
 * Server
 */
Promise.all([
  typescript.transpile(config.server.typescript.srcGlob, config.server.typescript.destDir, config.server.typescript.options),
  file.copy(config.server.html.srcGlob, config.server.html.destDir)
])
.then(() => {
  console.log('server is done')
})
.catch((error) => {
  console.log('server error', error, error.stack)
})

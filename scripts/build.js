const fs = require('fs')
const file = require('ido/file')
const html = require('ido/html')
const image = require('ido/image')
const scss = require('ido/scss')
const typescript = require('ido/typescript')
const vendor = require('ido/npm')

const root = '.'

// Static configuration
const config = {
  client: {
    scss: {
      entry: `${root}/client/src/index.scss`,
      bundle: `${root}/build/client/static/index.css`,
      options: {
        minify: true,
        rev: true,
        sourcemaps: false
      }
    },
    typescript: {
      entry: `${root}/client/src/index.ts`,
      bundle: `${root}/build/client/static/index.js`,
      options: {
        minify: true,
        rev: true,
        sourcemaps: false,
        tsconfig: `${root}/client/tsconfig.json`
      }
    },
    vendor: {
      entry: `${root}/client/package.json`,
      bundle: `${root}/build/client/static/vendor.js`,
      options: {
        minify: true,
        rev: true,
        sourcemaps: false
      }
    },
    html: {
      entry: `${root}/client/src/index.html`,
      bundle: `${root}/build/client/index.html`,
      options: {
        minify: false,
        inject: {
          templates: {
            globs: [`${root}/client/src/*/**/*.html`],
            cwd: root
          },
          globals: {
            globs: [`${root}/client/src/globals.ts`],
            cwd: root
          },
        }
      }
    }
  },
  resources: {
    favicon: {
      srcGlob: `${root}/resources/images/favicon.ico`,
      destDir: `${root}/build/resources/images`,
      options: {
        rev: true
      }
    },
    images: {
      srcGlob: `${root}/resources/images/*.png`,
      destDir: `${root}/build/resources/images`,
      options: {
        minify: true,
        rev: true
      }
    }
  },
  server: {
    html: {
      srcGlob: `${root}/server/src/**/*.html`,
      destDir: `${root}/build/server`
    },
    typescript: {
      srcGlob: `${root}/server/src/**/!(*.spec).ts`,
      destDir: `${root}/build/server`,
      options: {
        tsconfig: `${root}/server/tsconfig.json`
      }
    }
  }
}

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

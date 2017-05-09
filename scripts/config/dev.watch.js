const deepExtend = require('deep-extend')
const devBuildConfig = require('./dev.build')

const root = '.'

/**
 * Configure watches.
 */
module.exports = deepExtend({}, devBuildConfig, {
  client: {
    scss: {
      watch: `${root}/client/src/**/*.scss`,
      livereload: 'index.css'
    },
    typescript: {
      // Ignore globals.ts and spec files.
      watch: `${root}/client/src/**/!(globals|*.spec).ts`,
      livereload: 'index.js'
    },
    globals: {
      watch: `${root}/client/src/globals.ts`
    },
    vendor: {
      watch: `${root}/client/package.json`,
      livereload: 'vendor.js'
    },
    html: {
      watch: `${root}/client/src/**/*.html`,
      livereload: 'index.html'
    }
  },
  resources: {
    images: {
      watch: `${root}/resources/images/*.{ico,png}`,
      livereload: 'index.html'
    }
  },
  server: {
    html: {
      watch: `${root}/server/src/**/*.html`
    },
    typescript: {
      watch: `${root}/server/src/**/!(*.spec).ts`
    }
  }
})

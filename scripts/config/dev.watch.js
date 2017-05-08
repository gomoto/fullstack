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
      options: {
        livereload: 'index.css'
      }
    },
    typescript: {
      // Ignore globals.ts and spec files.
      watch: `${root}/client/src/**/!(globals|*.spec).ts`,
      options: {
        livereload: 'index.js'
      }
    },
    globals: {
      watch: `${root}/client/src/globals.ts`
    },
    vendor: {
      watch: `${root}/client/package.json`,
      options: {
        livereload: 'vendor.js'
      }
    },
    html: {
      watch: `${root}/client/src/**/*.html`,
      options: {
        livereload: 'index.html'
      }
    }
  },
  resources: {
    favicon: {
      watch: `${root}/resources/images/favicon.ico`,
      options: {
        livereload: 'index.html'
      }
    },
    images: {
      watch: `${root}/resources/images/*.png`,
      options: {
        livereload: 'index.html'
      }
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

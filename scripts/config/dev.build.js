const deepExtend = require('deep-extend')
const buildConfig = require('./build')

/**
 * Override build configuration.
 *
 * Setting `rev: false` makes life easier:
 * - html task no longer waits for other tasks that revise file names
 * - html task no longer requires manifests for revised file names.
 *
 * Minify each TypeScript module instead of the entire bundle for faster
 * incremental builds.
 */
module.exports = deepExtend({}, buildConfig, {
  client: {
    scss: {
      options: {
        minify: false,
        rev: false
      }
    },
    typescript: {
      options: {
        minify: false,
        minifyModules: true,
        rev: false
      }
    },
    vendor: {
      options: {
        minify: false,
        minifyModules: true,
        rev: false
      }
    }
  },
  resources: {
    images: {
      options: {
        rev: false
      }
    }
  }
})

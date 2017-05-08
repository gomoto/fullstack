const deepExtend = require('deep-extend')
const buildConfig = require('./build')

/**
 * Override build configuration.
 * Setting `rev: false` makes life easier:
 * - html task no longer waits for other tasks that revise file names
 * - html task no longer requires manifests for revised file names.
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
        rev: false
      }
    },
    vendor: {
      options: {
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

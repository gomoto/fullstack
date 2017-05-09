// Static configuration

const root = '.'

module.exports = {
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
        // Relative-path require(./[...]) is relative to __dirname
        external: Object.keys(require(`../../client/package.json`).dependencies),
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
        minify: true,
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
    images: {
      srcGlob: `${root}/resources/images/*.{ico,png}`,
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
  },
  git: `${root}/build/git-sha.txt`
}

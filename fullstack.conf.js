module.exports = function() {

  const names = {
    app: 'app',
    client: 'client',
    server: 'server',
    resources: 'resources'
  };

  return {
    client: {
      html: {
        entry: `${names.client}/src/index.html`,
        bundle: `${names.app}/${names.client}/index.html`,
        watch: `${names.client}/src/**/*.html`,
        inject: {
          templates: {
            globs: [`${names.client}/src/*/**/*.html`]
          },
          css: {
            globs: [`${names.app}/${names.client}/index-*.css`],
            cwd: `${names.app}/${names.client}`
          },
          js: {
            globs: [
              `${names.app}/${names.client}/vendor-*.js`,
              `${names.app}/${names.client}/index-*.js`
            ],
            cwd: `${names.app}/${names.client}`
          }
        }
      },
      scss: {
        entry: `${names.client}/src/index.scss`,
        bundle: `${names.app}/${names.client}/index.css`,
        watch: `${names.client}/src/**/*.scss`
      },
      ts: {
        entry: `${names.client}/src/index.ts`,
        bundle: `${names.app}/${names.client}/index.js`,
        watch: `${names.client}/src/**/*.ts`,
        tsconfig: `${names.client}/tsconfig.json`
      },
      vendors: {
        manifest: `${names.client}/vendors.json`,
        bundle: `${names.app}/${names.client}/vendor.js`
      }
    },
    server: {
      from: `${names.server}/src`,
      to: `${names.app}/${names.server}`,
      tsconfig: `${names.server}/tsconfig.json`
    },
    resources: {
      images: {
        from: `${names.resources}/images`,
        to: `${names.app}/${names.resources}/images`,
        manifest: `${names.app}/${names.resources}/images/manifest.json`
      }
    },
    gitCommit: `${names.app}/git-sha.txt`
  };
};

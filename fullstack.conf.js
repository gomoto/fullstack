module.exports = function() {

  const names = {
    app: 'app',
    client: 'client',
    static: 'static',
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
          globals: {
            globs: [`${names.client}/src/globals.ts`]
          },
          templates: {
            globs: [`${names.client}/src/*/**/*.html`]
          },
          css: {
            globs: [`${names.app}/${names.client}/${names.static}/index-*.css`],
            cwd: `${names.app}/${names.client}/${names.static}`
          },
          js: {
            globs: [
              `${names.app}/${names.client}/${names.static}/vendor-*.js`,
              `${names.app}/${names.client}/${names.static}/index-*.js`
            ],
            cwd: `${names.app}/${names.client}/${names.static}`
          }
        }
      },
      scss: {
        entry: `${names.client}/src/index.scss`,
        bundle: `${names.app}/${names.client}/${names.static}/index.css`,
        watch: `${names.client}/src/**/*.scss`
      },
      ts: {
        entry: `${names.client}/src/index.ts`,
        bundle: `${names.app}/${names.client}/${names.static}/index.js`,
        watch: `${names.client}/src/**/*.ts`,
        tsconfig: `${names.client}/tsconfig.json`
      },
      vendors: {
        manifest: `${names.client}/vendors.json`,
        bundle: `${names.app}/${names.client}/${names.static}/vendor.js`
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

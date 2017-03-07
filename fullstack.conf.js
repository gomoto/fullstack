module.exports = function() {

  const names = {
    app: 'app',
    client: 'client',
    static: 'static',
    server: 'server',
    resources: 'resources'
  };

  return {
    // Register services with fullstack container.
    services: {
      app: {
        name: 'app',
        file: './docker-compose.yml',//optional
        project: 'fullstack'//optional
      }
    },
    client: {
      html: {
        entry: `${names.client}/src/index.html`,
        bundle: `${names.app}/${names.client}/index.html`,
        watch: {
          glob: `${names.client}/src/**/*.html`,
          init: () => {
            console.log('Watching html files');
          },
          pre: function(event) {
            console.log('pre', event);
          },
          post: function(event) {
            console.log('post', event);
          }
        },
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
        watch: {
          glob: `${names.client}/src/**/*.scss`,
          init: () => {
            console.log('Watching scss files');
          }
        }
      },
      ts: {
        entry: `${names.client}/src/index.ts`,
        bundle: `${names.app}/${names.client}/${names.static}/index.js`,
        watch: {
          glob: `${names.client}/src/**/*.ts`,
          init: () => {
            console.log('Watching ts files');
          }
        },
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
      tsconfig: `${names.server}/tsconfig.json`,
      watch: {
        init: (services) => {
          console.log('Watching server files');
          services.app.start();
        },
        post: (services) => {
          console.log('Restarting app');
          services.app.restart();
        }
      }
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

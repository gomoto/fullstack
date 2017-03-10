module.exports = function(config) {

  console.log(`container src: ${config.src}`);
  console.log(`container build: ${config.build}`);

  const names = {
    client: 'client',
    static: 'static',
    server: 'server',
    resources: 'resources'
  };

  // Absolute paths.
  return {
    // Register services with fullstack container.
    services: {
      app: {
        name: 'app',
        file: `${config.src}/docker-compose.yml`,//optional
        project: 'fullstack'//optional
      }
    },
    client: {
      html: {
        entry: `${config.src}/${names.client}/src/index.html`,
        bundle: `${config.build}/${names.client}/index.html`,
        watch: {
          glob: `${config.src}/${names.client}/src/**/*.html`,
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
            globs: [`${config.src}/${names.client}/src/globals.ts`],
            cwd: `${config.src}`
          },
          templates: {
            globs: [`${config.src}/${names.client}/src/*/**/*.html`],
            cwd: `${config.src}`
          },
          css: {
            globs: [`${config.build}/${names.client}/${names.static}/index-*.css`],
            cwd: `${config.build}/${names.client}/${names.static}`
          },
          js: {
            globs: [
              `${config.build}/${names.client}/${names.static}/vendor-*.js`,
              `${config.build}/${names.client}/${names.static}/index-*.js`
            ],
            cwd: `${config.build}/${names.client}/${names.static}`
          }
        }
      },
      scss: {
        entry: `${config.src}/${names.client}/src/index.scss`,
        bundle: `${config.build}/${names.client}/${names.static}/index.css`,
        watch: {
          glob: `${config.src}/${names.client}/src/**/*.scss`,
          init: () => {
            console.log('Watching scss files');
          }
        }
      },
      ts: {
        entry: `${config.src}/${names.client}/src/index.ts`,
        bundle: `${config.build}/${names.client}/${names.static}/index.js`,
        watch: {
          glob: `${config.src}/${names.client}/src/**/*.ts`,
          init: () => {
            console.log('Watching ts files');
          }
        },
        tsconfig: `${config.src}/${names.client}/tsconfig.json`
      },
      vendors: {
        manifest: `${config.src}/${names.client}/package.json`,
        bundle: `${config.build}/${names.client}/${names.static}/vendor.js`,
        // Exclude types from vendor bundle.
        test: (vendor) => !vendor.includes('@types')
      }
    },
    server: {
      node_modules: {
        from: `${config.src}/${names.server}/node_modules`,
        to: `${config.build}/node_modules`,
        watch: {
          glob: `${config.src}/${names.server}/package.json`,
          pre: () => {
            console.log('copying node_modules could take some time...');
          },
          post: (services) => {
            console.log('Restarting app');
            services.app.restart();
          }
        }
      },
      ts: {
        from: `${config.src}/${names.server}/src`,
        to: `${config.build}/${names.server}`,
        watch: {
          glob: `${config.src}/${names.server}/src/**/*.ts`,
          post: (services) => {
            console.log('Restarting app');
            services.app.restart();
          }
        },
        tsconfig: `${config.src}/${names.server}/tsconfig.json`
      },
      watch: {
        // Before all server tasks
        init: (services) => {
          console.log('Watching server files');
          services.app.start();
        }
      }
    },
    resources: {
      images: {
        from: `${config.src}/${names.resources}/images`,
        to: `${config.build}/${names.resources}/images`,
        manifest: `${config.build}/${names.resources}/images/manifest.json`
      }
    },
    gitCommit: `${config.build}/git-sha.txt`
  };
};

module.exports = function() {

  // Absolute paths.
  const paths = {
    dockerCompose: '/docker-compose.yml',
    client: '/client',
    resources: '/resources',
    server: '/server',
    git: '/.git',
    build: '/build'
  };

  return {
    // Register services with fullstack container.
    services: {
      app: {
        name: 'app',
        file: paths.dockerCompose,//optional
        project: 'fullstack'//optional
      }
    },
    client: {
      html: {
        entry: `${paths.client}/src/index.html`,
        bundle: `${paths.build}/${paths.client}/index.html`,
        watch: {
          glob: `${paths.client}/src/**/*.html`,
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
            globs: [`${paths.client}/src/globals.ts`],
            cwd: '/'
          },
          templates: {
            globs: [`${paths.client}/src/*/**/*.html`],
            cwd: '/'
          },
          css: {
            globs: [`${paths.build}/${paths.client}/static/index-*.css`],
            cwd: `${paths.build}/${paths.client}/static`
          },
          js: {
            globs: [
              `${paths.build}/${paths.client}/static/vendor-*.js`,
              `${paths.build}/${paths.client}/static/index-*.js`
            ],
            cwd: `${paths.build}/${paths.client}/static`
          }
        }
      },
      scss: {
        entry: `${paths.client}/src/index.scss`,
        bundle: `${paths.build}/${paths.client}/static/index.css`,
        watch: {
          glob: `${paths.client}/src/**/*.scss`,
          init: () => {
            console.log('Watching scss files');
          }
        }
      },
      ts: {
        entry: `${paths.client}/src/index.ts`,
        bundle: `${paths.build}/${paths.client}/static/index.js`,
        watch: {
          glob: `${paths.client}/src/**/*.ts`,
          init: () => {
            console.log('Watching ts files');
          }
        },
        tsconfig: `${paths.client}/tsconfig.json`
      },
      vendors: {
        manifest: `${paths.client}/package.json`,
        bundle: `${paths.build}/${paths.client}/static/vendor.js`,
        // Exclude types from vendor bundle.
        test: (vendor) => !vendor.includes('@types')
      }
    },
    server: {
      node_modules: {
        from: `${paths.server}/node_modules`,
        to: `${paths.build}/node_modules`,
        watch: {
          glob: `${paths.server}/package.json`,
          pre: () => {
            console.log('copying node_modules could take some time...');
          },
          post: (event, services) => {
            console.log('Restarting app');
            services.app.restart();
          }
        }
      },
      ts: {
        from: `${paths.server}/src`,
        to: `${paths.build}/${paths.server}`,
        watch: {
          glob: `${paths.server}/src/**/*.ts`,
          post: (event, services) => {
            console.log('Restarting app');
            services.app.restart();
          }
        },
        tsconfig: `${paths.server}/tsconfig.json`
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
        from: `${paths.resources}/images`,
        to: `${paths.build}/${paths.resources}/images`,
        manifest: `${paths.build}/${paths.resources}/images/manifest.json`
      }
    },
    git: {
      directory: paths.git,
      commit: `${paths.build}/git-sha.txt`
    }
  };
};

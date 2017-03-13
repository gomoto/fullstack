module.exports = function() {

  // Mirror project directory in container.
  const paths = {
    root: __dirname,
    client: 'client',
    resources: 'resources',
    server: 'server',
    git: '.git',
    build: 'build'
  };

  // Absolute paths in the container.
  return {
    // Register services with fullstack container.
    services: {
      app: {
        name: 'app',
        file: `${paths.root}/docker-compose.yml`,//optional
        project: 'fullstack'//optional
      }
    },
    client: {
      html: {
        entry: `${paths.root}/${paths.client}/src/index.html`,
        bundle: `${paths.root}/${paths.build}/${paths.client}/index.html`,
        watch: {
          glob: `${paths.root}/${paths.client}/src/**/*.html`,
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
            globs: [`${paths.root}/${paths.client}/src/globals.ts`],
            cwd: `${paths.root}`
          },
          templates: {
            globs: [`${paths.root}/${paths.client}/src/*/**/*.html`],
            cwd: `${paths.root}`
          },
          css: {
            globs: [`${paths.root}/${paths.build}/${paths.client}/static/index-*.css`],
            cwd: `${paths.root}/${paths.build}/${paths.client}/static`
          },
          js: {
            globs: [
              `${paths.root}/${paths.build}/${paths.client}/static/vendor-*.js`,
              `${paths.root}/${paths.build}/${paths.client}/static/index-*.js`
            ],
            cwd: `${paths.root}/${paths.build}/${paths.client}/static`
          }
        }
      },
      scss: {
        entry: `${paths.root}/${paths.client}/src/index.scss`,
        bundle: `${paths.root}/${paths.build}/${paths.client}/static/index.css`,
        watch: {
          glob: `${paths.root}/${paths.client}/src/**/*.scss`,
          init: () => {
            console.log('Watching scss files');
          }
        }
      },
      ts: {
        entry: `${paths.root}/${paths.client}/src/index.ts`,
        bundle: `${paths.root}/${paths.build}/${paths.client}/static/index.js`,
        watch: {
          glob: `${paths.root}/${paths.client}/src/**/*.ts`,
          init: () => {
            console.log('Watching ts files');
          }
        },
        tsconfig: `${paths.root}/${paths.client}/tsconfig.json`
      },
      vendors: {
        manifest: `${paths.root}/${paths.client}/package.json`,
        bundle: `${paths.root}/${paths.build}/${paths.client}/static/vendor.js`,
        // Exclude types from vendor bundle.
        test: (vendor) => !vendor.includes('@types')
      }
    },
    server: {
      node_modules: {
        from: `${paths.root}/${paths.server}/node_modules`,
        to: `${paths.root}/${paths.build}/node_modules`,
        watch: {
          glob: `${paths.root}/${paths.server}/package.json`,
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
        from: `${paths.root}/${paths.server}/src`,
        to: `${paths.root}/${paths.build}/${paths.server}`,
        watch: {
          glob: `${paths.root}/${paths.server}/src/**/*.ts`,
          post: (event, services) => {
            console.log('Restarting app');
            services.app.restart();
          }
        },
        tsconfig: `${paths.root}/${paths.server}/tsconfig.json`
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
        from: `${paths.root}/${paths.resources}/images`,
        to: `${paths.root}/${paths.build}/${paths.resources}/images`,
        manifest: `${paths.root}/${paths.build}/${paths.resources}/images/manifest.json`
      }
    },
    git: {
      directory: `${paths.root}/${paths.git}`,
      commit: `${paths.root}/${paths.build}/git-sha.txt`
    }
  };
};

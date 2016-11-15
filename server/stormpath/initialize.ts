import express = require('express');
const stormpath = require('express-stormpath');
import path = require('path');

export default (app: express.Application) => {
  const indexRoute = path.resolve(`${app.get('appPath')}/index.html`);

  return stormpath.init(app, {
    expand: {
      groups: true
    },
    website: true,
    web: {
      me: {
        expand: {
          customData: true,
          groups: true
        }
      },
      spaRoot: indexRoute
    }
  });
}

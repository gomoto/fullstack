// Enable stormpath

import express = require('express');
const stormpath = require('express-stormpath');
import config from './environment';

export default (app: express.Application) => {
  const env = app.get('env');

  // disable stormpath in test mode
  if (env === 'test') {
    return;
  }

  // Preempt stormpath handling of login route.
  // Let frontend app handle the login view.
  app.get(config.login, (req, res, next) => {
    if (req.accepts('html')) {
      return res.sendFile(app.get('application'));
    }
    next();
  });

  app.use(stormpath.init(app, {
    expand: {
      groups: true
    },
    website: true,
    web: {
      login: {
        enabled: true,
        uri: config.login
      },
      logout: {
        enabled: true,
        uri: config.logout
      },
      me: {
        expand: {
          customData: true,
          groups: true
        }
      },
      spaRoot: app.get('application')
    }
  }));

}

// Enable stormpath

import express = require('express');
const stormpath = require('express-stormpath');
import path = require('path');

export default (app: express.Application) => {
  const env = app.get('env');

  // disable stormpath in test mode
  if (env === 'test') {
    return;
  }

  const indexRoute = path.resolve(`${app.get('appPath')}/index.html`);

  // Preempt stormpath handling of login route.
  // Let frontend app handle the login view.
  app.use((req, res, next) => {
    // login uri not known until stormpath initializes
    const loginPath = req.app.get('stormpathConfig').web.login.uri;

    // if user hits the login uri directly, send the frontend app
    if (req.path === loginPath && req.accepts('html')) {
      return res.sendFile(indexRoute);
    }

    next();
  });

  app.use(stormpath.init(app, {
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
  }));

}

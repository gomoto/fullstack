// Enable stormpath

import express = require('express');
const stormpath = require('express-stormpath');
import config from './environment';

export default (app: express.Application) => {

  // disable stormpath in test mode
  if (config.env === 'test') {
    return;
  }

  app.use(stormpath.init(app, {
    web: {
      idSite: {
        enabled: true,
        uri: '/idSiteResult',
        nextUri: '/'
      },
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
      }
    }
  }));

}

import express = require('express');
// TODO: express-stormpath and its types should be imported as one
import * as sp from './express-stormpath';
const stormpath = require('express-stormpath') as sp.ExpressStormpath;
import config from './environment';
import logger from './logger';


// Enable stormpath middleware
export default (app: express.Application) => {
  logger.info('Configuring stormpath');
  return stormpath.init(app, {
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
  });
}

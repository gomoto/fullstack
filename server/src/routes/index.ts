/**
 * Application routes
 */

import express = require('express');
import logger from '../components/logger';
import { settings } from '../settings';
import { apiRouter } from './api';

// Router factory
export default () => {
  logger.info('Configuring routes');

  const router = express.Router();

  // API routes
  router.use('/api', apiRouter());

  router.get('/version', (req, res) => {
    res.sendFile(`${settings.root}/git-sha.txt`);
  });

  // Routes for api and resources should have already been served.
  // Return a 404 for all undefined resource or api routes.
  router.route('/:url(api|resources)/*')
  .get((req, res) => {
    res.sendStatus(404);
  });

  // Auth0 silent-callback view.
  router.get(settings.auth0.silentCallbackPath, (req, res) => {
    /**
     * Get host from 'Host' header or from 'X-Forwarded-Host' header if the
     * application has been configured to trust upstream proxies via
     * app.set('trust proxy', true).
     *
     * This function exists because in Express < 5, req.host is unreliable
     * beacuse it strips the port.
     *
     * See https://github.com/expressjs/express/issues/2179
     */
    var hostHeader = req.headers.host;
    var xForwardedHostHeader = req.headers['x-forwarded-host'];
    const host = req.app.get('trust proxy') ? (xForwardedHostHeader || hostHeader) : hostHeader;
    res.render('auth0-silent-callback.html', {
      AUTH0_CLIENT_ID: settings.auth0.clientId,
      AUTH0_DOMAIN: settings.auth0.domain,
      TARGET_ORIGIN: `${req.protocol}://${host}`
    });
  });

  // Route for getting fake user object; only enabled when offline.
  if (settings.offlineUser.enabled) {
    router.get('/me', (req, res, next) => {
      res.status(200).json(settings.offlineUser.user);
    });
  }

  // All other routes should redirect to the index.html
  router.route('/*')
  .get((req, res) => {
    res.render('index.html', {
      AUTH0_CLIENT_ID: settings.auth0.clientId,
      AUTH0_DOMAIN: settings.auth0.domain,
      NODE_ENV: settings.env,
      OFFLINE_USER: settings.offlineUser.enabled,
      CALLBACK_PATH: settings.auth0.callbackPath,
      SILENT_CALLBACK_PATH: settings.auth0.silentCallbackPath
    });
  });

  return router;
}

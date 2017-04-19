/**
 * Application routes
 */

import express = require('express');
import mongodb = require('mongodb');
import logger from '../components/logger';
import { settings } from '../settings';
import { authenticationRequired } from '../middleware';

// Routes
import thing from './api/thing';

// Router factory
export default (database: mongodb.Db) => {
  logger.info('Configuring routes');

  const router = express.Router();

  // API routes
  router.use('/api', authenticationRequired());
  router.use('/api/things', thing(database));

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
    res.render(`${settings.paths.views}/auth0-silent-callback.html`, {
      AUTH0_CLIENT_ID: settings.auth0.clientId,
      AUTH0_DOMAIN: settings.auth0.domain,
      APP_DOMAIN: settings.domain
    });
  });

  // All other routes should redirect to the index.html
  router.route('/*')
  .get((req, res) => {
    res.render(settings.paths.application, {
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

/**
 * Application routes
 */

import express = require('express');
import mongodb = require('mongodb');
import * as sp from '../express-stormpath.d';
const expressStormpath = require('express-stormpath') as sp.ExpressStormpath;
import * as expressStormpathOffline from 'express-stormpath-offline';
import logger from '../components/logger';
import { settings } from '../settings';
import * as jwt from 'express-jwt';

// Routes
import thing from './api/thing';

// Router factory
export default (database: mongodb.Db) => {
  logger.info('Configuring routes');

  const router = express.Router();

  // Auth middleware
  let authenticationRequired: () => express.RequestHandler;
  let groupsRequired: (groups: string[], all?: boolean) => express.RequestHandler;
  if (settings.stormpath.enabled) {
    authenticationRequired = () => expressStormpath.authenticationRequired;
    groupsRequired = expressStormpath.groupsRequired;
  } else {
    authenticationRequired = expressStormpathOffline.authenticationRequired;
    groupsRequired = expressStormpathOffline.groupsRequired;
  }

  groupsRequired = (groups: string[]) => {
    return (req, res, next) => {
      const metadata = req.user.app_metadata;
      if (!metadata || !metadata.authorization || !metadata.authorization.groups) {
        return res.sendStatus(401);
      }
      // User must have all groups.
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        // User does not have this group.
        if (metadata.authorization.groups.indexOf(group) === -1) {
          return res.sendStatus(401);
        }
      }
      // User has all groups. Success.
      next();
    };
  };

  // API routes
  router.use('/api', authenticationRequired());
  router.use('/api', jwt(settings.jwt));
  if (settings.apiGroups.length > 0) {
    router.use('/api', groupsRequired(settings.apiGroups, false));
  }

  // Admin routes
  router.use('/admin', authenticationRequired());
  if (settings.adminGroups.length > 0) {
    router.use('/admin', groupsRequired(settings.adminGroups, false));
  }

  // All routes
  router.use('/api/things', thing);
  router.use('/admin/things', thing);

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
  router.get('/silent-callback', (req, res) => {
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
      NODE_ENV: settings.env
    });
  });

  return router;
}

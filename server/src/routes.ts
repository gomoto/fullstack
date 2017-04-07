/**
 * Main application routes
 */

import express = require('express');
import mongodb = require('mongodb');
import * as sp from './config/express-stormpath.d';
const expressStormpath = require('express-stormpath') as sp.ExpressStormpath;
import * as expressStormpathOffline from 'express-stormpath-offline';
import config from './config/environment';
import logger from './config/logger';
import { settings } from './config/settings';


// Routes
import thing from './api/thing';


export default (app: express.Application, database: mongodb.Db) => {
  logger.info('Configuring routes');

  // Auth middleware
  let authenticationRequired: () => express.RequestHandler;
  let groupsRequired: (groups: string[], all?: boolean) => express.RequestHandler;
  if (settings.stormpathOnline) {
    authenticationRequired = () => expressStormpath.authenticationRequired;
    groupsRequired = expressStormpath.groupsRequired;
  } else {
    authenticationRequired = expressStormpathOffline.authenticationRequired;
    groupsRequired = expressStormpathOffline.groupsRequired;
  }

  // API routes
  app.use('/api', authenticationRequired());
  if (config.apiGroups.length > 0) {
    app.use('/api', groupsRequired(config.apiGroups, false));
  }

  // Admin routes
  app.use('/admin', authenticationRequired());
  if (config.adminGroups.length > 0) {
    app.use('/admin', groupsRequired(config.adminGroups, false));
  }

  // All routes
  app.use('/api/things', thing);
  app.use('/admin/things', thing);

  app.get('/version', (req, res) => {
    res.sendFile(`${config.root}/git-sha.txt`);
  });

  // Routes for api and resources should have already been served.
  // Return a 404 for all undefined resource or api routes.
  app.route('/:url(api|resources)/*')
  .get((req, res) => {
    res.sendStatus(404);
  });

  // All other routes should redirect to the index.html
  app.route('/*')
  .get((req, res) => {
    res.render(settings.application, {
      NODE_ENV: config.env
    });
  });

}

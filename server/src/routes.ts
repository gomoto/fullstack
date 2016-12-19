/**
 * Main application routes
 */

import express = require('express');
import * as sp from './config/express-stormpath';
const stormpath = require('express-stormpath') as sp.ExpressStormpath;
import config from './config/environment';


// Routes
import thing from './api/thing';


export default (app: express.Application) => {
  // const gitSha = '/app/git-sha.txt';

  // Authenticated routes
  if (config.env === 'production' || config.env === 'development') {
    // API routes
    app.use('/api', stormpath.loginRequired);
    if (config.apiGroups.length > 0) {
      app.use('/api', stormpath.groupsRequired(config.apiGroups, false));
    }

    // Admin routes
    app.use('/admin', stormpath.loginRequired);
    if (config.adminGroups.length > 0) {
      app.use('/admin', stormpath.groupsRequired(config.adminGroups, false));
    }
  }

  // All routes
  app.use('/api/things', thing);
  app.use('/admin/things', thing);

  // app.route('/version')
  // .get((req, res) => {
  //   res.sendFile(gitSha);
  // });

  // Routes for api and assets should have already been served.
  // Return a 404 for all undefined asset or api routes.
  app.route('/:url(api|assets)/*')
  .get((req, res) => {
    res.sendStatus(404);
  });

  // All other routes should redirect to the index.html
  app.route('/*')
  .get((req, res) => {
    res.sendFile(app.get('application'));
  });

}

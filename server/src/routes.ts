/**
 * Main application routes
 */

import express = require('express');
import * as sp from './config/express-stormpath';
const stormpath = require('express-stormpath') as sp.ExpressStormpath;


// Routes
import thing from './api/thing';


export default (app: express.Application) => {
  // const gitSha = '/app/git-sha.txt';
  const env = app.get('env') as string;

  // Authenticated routes
  if (env === 'production' || env === 'development') {
    // API routes
    if (process.env.API_GROUPS) {
      const groups = process.env.API_GROUPS.split(',');
      app.use('/api', stormpath.loginRequired, stormpath.groupsRequired(groups, false));
    }
    else {
      app.use('/api', stormpath.loginRequired);
    }

    // Admin routes
    app.use('/admin', stormpath.loginRequired);
    if (process.env.ADMIN_GROUPS) {
      const groups = process.env.ADMIN_GROUPS.split(',');
      app.use('/admin', stormpath.groupsRequired(groups, false));
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

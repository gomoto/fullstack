/**
 * Main application routes
 */

import express = require('express');
const stormpath = require('express-stormpath');
import requireGroups from './stormpath/require-groups';


// Routes
import thing from './api/thing';


export default (app: express.Application) => {
  // const gitSha = '/app/git-sha.txt';

  // Authenticated routes
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    // require group authorization for /api endpoint
    if (process.env.STORMPATH_GROUPS) {
      const groups = process.env.STORMPATH_GROUPS.split(',');
      app.use('/api', stormpath.loginRequired, requireGroups(groups));
    }
    else {
      app.use('/api', stormpath.loginRequired);
    }
  }

  // All routes
  app.use('/api/things', thing);

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

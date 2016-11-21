/**
 * Main application routes
 */

import express = require('express');
import path = require('path');
const stormpath = require('express-stormpath');
import requireGroups from './stormpath/require-groups';


// Routes
import thing from './api/thing';


export default (app: express.Application) => {
  // const gitSha = '/app/git-sha.txt';
  const indexRoute = path.resolve(`${app.get('appPath')}/index.html`);

  // Preempt stormpath handling of /login route.
  // Let frontend app handle the login view.
  app.get('/login', (req, res, next) => {
    if (req.accepts('html')) {
      return res.sendFile(indexRoute);
    }
    next();
  });

  // Stormpath
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

  // Insert routes below
  app.use('/api/things', thing);

  // app.route('/version')
  // .get((req, res) => {
  //   res.sendFile(gitSha);
  // });

  // All other routes should redirect to the index.html
  app.route('/*')
  .get((req, res) => {
    res.sendFile(indexRoute);
  });

}

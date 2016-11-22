/**
* Express configuration
*/

import express = require('express');
import favicon = require('serve-favicon');
import morgan = require('morgan');
const shrinkRay = require('shrink-ray');
import bodyParser = require('body-parser');
import methodOverride = require('method-override');
import cookieParser = require('cookie-parser');
import csurf = require('csurf');
import path = require('path');
import errorHandler = require('errorhandler');

import config from './environment';
const imageManifest = require(`${config.root}/client/assets/images/manifest.json`);



export default (app: express.Application) => {
  const env = app.get('env');

  app.use(favicon(path.join(config.root, 'client/assets/images', imageManifest['favicon.ico'])));
  app.set('appPath', path.join(config.root, 'client'));
  app.use(express.static(app.get('appPath')));
  app.use(morgan('dev'));

  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // stormpath parses and signs cookies, but stormpath might not be used.
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // cross-site request forgery protection (angular)
  app.use(csurf({ cookie: true }));
  app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken() /*, { signed: true }*/);
    next();
  });

  if(env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
};

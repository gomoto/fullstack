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
import stormpath from './express-stormpath';
import stormpathOffline from './express-stormpath-offline';
import logger from './logger';


export default (app: express.Application) => {
  logger.info('Configuring express');

  // paths - where are things located?
  app.set('client', path.join(config.root, 'client'));
  app.set('application', path.join(app.get('client'), 'index.html'));

  app.use(favicon(path.join(config.root, 'client/assets/images', imageManifest['favicon.ico'])));
  app.use(express.static(app.get('client')));
  app.use(morgan('dev'));

  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // stormpath parses and signs cookies, but stormpath might not be used.
  app.use(cookieParser(config.cookieSecret));

  // cross-site request forgery protection (angular)
  app.use(csurf({ cookie: true }));
  app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken() /*, { signed: true }*/);
    next();
  });

  if(config.env === 'development' || config.env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }

  // stormpath
  if (app.enabled('stormpathOnline')) {
    app.use(stormpath(app));
  } else {
    app.use(stormpathOffline(app));
  }
};

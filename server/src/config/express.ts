/**
* Express configuration
*/

import express = require('express');
import morgan = require('morgan');
const shrinkRay = require('shrink-ray');
import bodyParser = require('body-parser');
import methodOverride = require('method-override');
import cookieParser = require('cookie-parser');
import csurf = require('csurf');
import path = require('path');
import ejs = require('ejs');
import errorHandler = require('errorhandler');

import config from './environment';
import { settings } from '../config/settings';
import stormpath from './express-stormpath';
import stormpathOffline from './express-stormpath-offline';
import logger from './logger';


export default (app: express.Application) => {
  logger.info('Configuring express');

  // Use EJS to render HTML files.
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');

  // Let express know where to look for views.
  app.set('views', [settings.paths.application]);

  app.use(express.static(settings.paths.client));
  app.use(express.static(settings.paths.resources));
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
    app.use(require('connect-livereload')());
    app.use(errorHandler()); // Error handler - has to be last
  }

  // stormpath
  if (settings.stormpathOnline) {
    app.use(stormpath(app));
    app.on('stormpath.ready', () => logger.info('Stormpath is online'));
  } else {
    app.use(stormpathOffline(app));
  }
};

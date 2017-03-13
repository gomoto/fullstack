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
import stormpath from './express-stormpath';
import stormpathOffline from './express-stormpath-offline';
import logger from './logger';


export default (app: express.Application) => {
  logger.info('Configuring express');

  // paths - where are things located?
  app.set('client', path.join(config.root, 'client', 'static'));
  app.set('resources', path.join(config.root, 'resources'));
  app.set('application', path.join(config.root, 'client', 'index.html'));

  // Use EJS to render HTML files.
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');

  // Let express know where to look for views.
  app.set('views', [app.get('application')]);

  app.use(express.static(app.get('client')));
  app.use(express.static(app.get('resources')));
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
  app.set('stormpathOnline', config.env === 'production');

  if (app.enabled('stormpathOnline')) {
    app.use(stormpath(app));
    app.on('stormpath.ready', () => logger.info('Stormpath is online'));
  } else {
    app.use(stormpathOffline(app));
  }
};

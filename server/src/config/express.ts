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
import initializeStormpath from '../stormpath/initialize';
import errorHandler = require('errorhandler');
import ejs = require('ejs');

import config from './environment';
const imageManifest = require(`${config.root}/client/assets/images/manifest.json`);



export default (app: express.Application) => {
  const env = app.get('env');

  app.use(favicon(path.join(config.root, 'client/assets/images', imageManifest['favicon.ico'])));
  app.set('appPath', path.join(config.root, 'client'));
  app.use(express.static(app.get('appPath')));
  app.use(morgan('dev'));

  app.set('views', `${config.root}/server/views`);
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');
  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  if (env !== 'test') {
    app.use(initializeStormpath(app));
  }

  // stormpath parses and signs cookies, but stormpath might not be used.
  app.use(cookieParser());

  // cross-site request forgery protection (angular)
  app.use(csurf({ cookie: true }));
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.cookie('XSRF-TOKEN', req.csrfToken() /*, { signed: true }*/);
    next();
  });

  if(env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
};

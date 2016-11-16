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
import path = require('path');
import session = require('express-session');
const lusca = require('lusca');
import errorHandler = require('errorhandler');
import ejs = require('ejs');
// import passport = require('passport');

import config from './environment';



export default (app: express.Application) => {
  const env = app.get('env');

  if(env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
  }

  app.use(favicon(path.join(config.root, 'client', 'assets', 'favicon.ico')));
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
  app.use(cookieParser());
  // app.use(passport.initialize());

  // Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if(env !== 'test') {
    app.use(lusca({
      csrf: {
        angular: true
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  // if ('development' === env || 'test' === env) {
  //   app.use(require('connect-livereload')());
  // }

  if(env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
};

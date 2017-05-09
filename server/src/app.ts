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
import { settings } from './settings';
import logger from './components/logger';

/**
 * Express application.
 */
const app = express() as express.Application;

logger.info('Initializing express application');

// Use EJS to render HTML files.
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// Let express know where to look for views.
app.set('views', [
  settings.paths.client,
  settings.paths.views
]);

app.use(express.static(settings.paths.static));
app.use(express.static(settings.paths.resources));
app.use(morgan('dev'));

app.use(shrinkRay());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());

// cross-site request forgery protection (angular)
app.use(csurf({ cookie: true }));
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

if(settings.env === 'development' || settings.env === 'test') {
  app.use(require('connect-livereload')());
  app.use(errorHandler()); // Error handler - has to be last
}

export { app }

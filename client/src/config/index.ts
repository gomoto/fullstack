import * as angular from 'angular';
import 'angular-ui-router';
import { config as configureRoutes } from './routes.config';
import { config as configureProduction } from './production.config';
import { redirect as redirectRoutes } from './routes.redirect';

export default angular.module('app.config', [
  'ui.router'
])
.constant('NODE_ENV', AppGlobals.settings.NODE_ENV)
.config(configureProduction)
.config(configureRoutes)
.run(redirectRoutes)
.name;

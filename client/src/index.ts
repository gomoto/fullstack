import * as angular from 'angular';
import auth from './auth';
import components from './components';
import errors from './errors';
import config from './config';

angular.module('app', [
  config,
  auth,
  components,
  errors
]);

/**
 * Manually bootstrap application.
 * This lets us assume user is authenticated throughout app.
 * This also prevents flashes of app loading during auth flow.
 */
angular.bootstrap(document, ['app'], { strictDi: true });

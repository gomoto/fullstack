import * as angular from 'angular';
import auth from './auth';
import components from './components';
import errors from './errors';
import config from './config';
import { authenticate } from './auth/auth-zero';

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
authenticate((err) => {
  if (err) {
    console.error(err);
    return;
  }
  angular.bootstrap(document, ['app'], { strictDi: true });
});

/**
 * Authentication and authorization
 */

// angular-auth0 looks for global `Auth0`...
window['Auth0'] = require('auth0-js');

import * as angular from 'angular';
import 'angular-ui-router';
import 'angular-auth0';
import 'angular-jwt';
import * as stormpath from 'stormpath-sdk-angularjs';
import configureStormpath from './configure-stormpath';
import enableStormpath from './enable-stormpath';
import { AuthService } from './auth.service';
import { configure } from './configure';
import { run } from './run';

export default angular.module('auth', [
  'ui.router',
  'auth0.auth0',
  'angular-jwt',
  stormpath,
  'stormpath.templates'
])
.config(configureStormpath)
.run(enableStormpath)
.service('AuthService', AuthService)
.config(configure)
.run(run)
.name;

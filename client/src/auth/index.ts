/**
 * Authentication and authorization
 */

import * as angular from 'angular';
import 'angular-ui-router';
import * as stormpath from 'stormpath-sdk-angularjs';
import enableStormpath from './enable-stormpath';

export default angular.module('auth', [
  'ui.router',
  stormpath,
  'stormpath.templates'
])
.run(enableStormpath)
.name;

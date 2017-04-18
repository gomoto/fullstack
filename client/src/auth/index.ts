/**
 * Authentication and authorization
 */

import * as angular from 'angular';
import 'angular-ui-router';
import 'angular-jwt';
import { AuthService } from './auth.service';
import { configure } from './configure';

export default angular.module('auth', [
  'ui.router',
  'angular-jwt'
])
.service('AuthService', AuthService)
.config(configure)
.name;

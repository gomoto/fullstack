import angular = require('angular');
import LoginController from './login.controller';

export default angular.module('components.login', [])
.component('login', {
  templateUrl: 'client/src/components/login/login.html',
  controller: LoginController
})
.name;

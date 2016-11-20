import angular = require('angular');
import LoginController from './login.controller';

export default angular.module('app.login', [])
.component('login', {
  templateUrl: 'client/src/modules/login/login.html',
  controller: LoginController
})
.name;

import * as angular from 'angular';
import dashboard from './dashboard/dashboard.module';
import home from './home/home.module';
import login from './login/login.module';

export default angular.module('components', [
  dashboard,
  home,
  login
])
.name;

import angular = require('angular');
import DashboardController from './dashboard.controller';

export default angular.module('app.dashboard', [])
.component('dashboard', {
  templateUrl: 'client/src/modules/dashboard/dashboard.html',
  controller: DashboardController
})
.name;

import angular = require('angular');
import HomeController from './home.controller';

export default angular.module('app.home', [])
.component('home', {
  templateUrl: 'client/src/modules/home/home.html',
  controller: HomeController
})
.name;

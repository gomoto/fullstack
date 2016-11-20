import { ILogService } from 'angular';

export default class DashboardController {

  static $inject = [
    '$log'
  ];

  constructor(
    private $log: ILogService
  ) {}

}

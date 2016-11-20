import { ILogService } from 'angular';

export default class HomeController {

  static $inject = [
    '$log'
  ];

  constructor(
    private $log: ILogService
  ) {}

}

import { ILogService } from 'angular';

export default class LoginController {

  static $inject = [
    '$log'
  ];

  constructor(
    private $log: ILogService
  ) {}

}

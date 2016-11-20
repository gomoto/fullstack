import { ILogService } from 'angular';

export default class WidgetController {

  static $inject = [
    '$log'
  ];

  constructor(
    private $log: ILogService
  ) {}

}

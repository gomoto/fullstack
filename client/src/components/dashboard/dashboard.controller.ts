import { AuthService } from '../../auth/auth.service';
import { getUser } from '../../auth/auth-zero';

export default class DashboardController {

  static $inject = [
    'AuthService',
    '$http',
    '$log'
  ];

  public isCreatingThing: boolean;
  public things: Thing[];
  public thingName: string;

  constructor(
    private AuthService: AuthService,
    private $http: ng.IHttpService,
    private $log: ng.ILogService
  ) {
    this.isCreatingThing = false;
    this.things = [];
    this.thingName = '';
  }

  public $onInit() {
    this.getAllThings();
  }

  public getUserFullName(): string {
    const user = this.AuthService.user;
    return `${user.firstName} ${user.lastName}`;
  }

  public createThing(name: string) {
    if (!name) {
      return;
    }
    this.isCreatingThing = true;
    this.$http({
      method: 'POST',
      url: '/api/things',
      data: { name }
    })
    .then((response) => {
      this.isCreatingThing = false;
      this.$log.debug('Created thing', response);
      this.getAllThings();
    })
    .catch((err) => {
      this.$log.debug(err);
    });
    this.thingName = '';
  }

  /**
   * Get all things from database.
   * @return {ng.IPromise<Thing[]>}
   */
  private getAllThings(): ng.IPromise<Thing[]> {
    this.$log.debug('Getting all things from database');
    return this.$http<Thing[]>({
      method: 'GET',
      url: '/api/things'
    })
    .then<Thing[]>((response) => {
      this.things = response.data;
      return this.things;
    })
    .catch((err) => {
      this.$log.debug(err);
      return [];
    });
  }

  public logout(): void {
    this.AuthService.logout();
  }
}

interface Thing {
  name: string;
}

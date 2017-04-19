import { AuthService } from '../../auth/auth.service';

export default class DashboardController {

  static $inject = [
    'AuthService',
    '$http'
  ];

  public isCreatingThing: boolean;
  public things: Thing[];
  public thingName: string;

  constructor(
    private AuthService: AuthService,
    private $http: ng.IHttpService
  ) {
    this.isCreatingThing = false;
    this.things = [];
    this.thingName = '';
  }

  public $onInit() {
    this.getAllThings();
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
      console.log('Created thing', response);
      this.getAllThings();
    })
    .catch((err) => {
      console.log(err);
    });
    this.thingName = '';
  }

  /**
   * Get all things from database.
   * @return {ng.IPromise<Thing[]>}
   */
  private getAllThings(): ng.IPromise<Thing[]> {
    console.log('Getting all things from database');
    return this.$http<Thing[]>({
      method: 'GET',
      url: '/api/things'
    })
    .then<Thing[]>((response) => {
      this.things = response.data;
      return this.things;
    })
    .catch((err) => {
      console.log(err);
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

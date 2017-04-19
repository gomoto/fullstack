import { AuthService } from '../../auth/auth.service';

export default class DashboardController {

  static $inject = [
    'AuthService',
    '$http'
  ];

  public isCreatingThing: boolean;

  constructor(
    private AuthService: AuthService,
    private $http: ng.IHttpService
  ) {
    this.isCreatingThing = false;
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
    });
  }

  public logout(): void {
    this.AuthService.logout();
  }
}

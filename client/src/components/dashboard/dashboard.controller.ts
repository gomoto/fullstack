import { AuthService } from '../../auth/auth.service';

export default class DashboardController {

  static $inject = [
    'AuthService'
  ];

  constructor(
    private AuthService: AuthService
  ) {}

  public logout(): void {
    this.AuthService.logout();
  }
}

export default class LoginController {

  static $inject = [
    '$auth',
    '$log'
  ];

  constructor(
    private $auth: ng.stormpath.IAuthService,
    private $log: ng.ILogService
  ) {}

  username: string;
  password: string;

  posting = false;
  error: string;

  submit(): void {
    this.posting = true;
    this.error = null;
    this.$auth.authenticate({
      username: this.username,
      password: this.password
    })
    .catch((err) => {
      this.error = err.message;
    })
    .finally(() => {
      this.posting = false;
    });
  }

}

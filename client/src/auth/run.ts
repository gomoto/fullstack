import { AuthService } from './auth.service';

/**
 * Inject auth service into run block.
 */
run.$inject = [
  'AuthService'
];

/**
 * Initialize auth service.
 */
function run(
  AuthService: AuthService
): void {
  console.log('Initializing auth service.');
  AuthService.syncWithAuth0();
}

export { run }

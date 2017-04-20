import { unauthenticate } from './auth-zero';

class AuthService {
  // Redirects to auth0.com
  public logout() {
    unauthenticate();
  }
}

export { AuthService }

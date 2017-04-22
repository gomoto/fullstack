import {
  getUser,
  unauthenticate
} from './auth-zero';
import { Auth0User } from '../../../shared';

class AuthService {
  private _user: User;

  constructor() {
    this._user = this._createUser(getUser());
  }

  /**
   * Convert Auth0User to app user.
   * @param {Auth0User} user
   * @return {User}
   */
  private _createUser(user: Auth0User): User {
    return {
      id: user.user_id,
      firstName: user.user_metadata && user.user_metadata.first_name || '',
      lastName: user.user_metadata && user.user_metadata.last_name || '',
      isAdmin: (
        user.app_metadata.authorization &&
        user.app_metadata.authorization.roles &&
        // TODO: inject an admin role
        user.app_metadata.authorization.roles.indexOf('admin') > -1
      )
    };
  }

  public get user(): User {
    return this._user;
  }

  // Redirects to auth0.com
  public logout() {
    unauthenticate();
  }
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export { AuthService }

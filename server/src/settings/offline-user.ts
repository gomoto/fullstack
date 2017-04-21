import { User } from '../../../shared';

const env = process.env;

const settings = {
  enabled: env.OFFLINE_USER === 'true',

  // This should have the same shape as an Auth0 user.
  user: <User> {
    user_id: env.OFFLINE_USER_ID || 'test',
    email: env.OFFLINE_USER_EMAIL || 'test@test.com',
    app_metadata: {
      authorization: {
        groups: env.OFFLINE_USER_GROUPS && env.OFFLINE_USER_GROUPS.split(',') || [],
        roles: env.OFFLINE_USER_ROLES && env.OFFLINE_USER_ROLES.split(',') || [],
        permissions: env.OFFLINE_USER_PERMISSIONS && env.OFFLINE_USER_PERMISSIONS.split(',') || [
          'read:thing',
          'create:thing'
        ]
      }
    },
    user_metadata: {
      first_name: env.OFFLINE_USER_FIRST_NAME || 'First',
      last_name: env.OFFLINE_USER_LAST_NAME || 'Last',
      username: env.OFFLINE_USER_USERNAME || 'test'
    }
  }
};

export { settings }

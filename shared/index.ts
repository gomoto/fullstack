interface User {
  user_id: string;
  email: string;
  app_metadata: {
    authorization: {
      groups: string[];
      roles: string[];
      permissions: string[];
    };
  };
  user_metadata: {
    first_name: string;
    last_name: string;
  };
}

/**
 * Get full name from user object.
 * @param {User} user
 * @return {string}
 */
function getUserFullName(user: User): string {
  return (
    user &&
    user.user_metadata &&
    user.user_metadata.first_name &&
    user.user_metadata.last_name &&
    `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
  ) || '';
}

export {
  getUserFullName,
  User
}

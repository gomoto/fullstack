interface Auth0User {
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

export {
  Auth0User
}

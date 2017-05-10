import * as express from 'express';
const jwt = require('express-jwt');

function doesUserHaveAllRoles(userRoles: string[], roles: string[]): boolean {
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    if (userRoles.indexOf(role) === -1) {
      // User doesn't have this role. Whole check fails.
      return false;
    }
  }
  return true;
}

/**
 * Middleware that requires the user have ALL specified roles.
 * @param  {string[]} roles
 * @return {express.RequestHandler}
 */
function rolesRequired(roles: string[]): express.RequestHandler {
  // Check roles in JWT.
  return (req, res, next) => {
    if (
      !req.user.app_metadata ||
      !req.user.app_metadata.authorization ||
      !req.user.app_metadata.authorization.roles ||
      !doesUserHaveAllRoles(req.user.app_metadata.authorization.roles, roles)
    ) {
      return res.sendStatus(403);
    }
    next();
  };
}

export {
  rolesRequired
}

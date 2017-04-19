import * as express from 'express';
import { settings } from '../settings';

/**
 * Middleware that requires a single Auth0 permission.
 * @param  {string} permission
 * @return {express.RequestHandler}
 */
function permissionRequired(permission: string): express.RequestHandler {
  if (settings.offlineUser.enabled) {
    return (req, res, next) => {
      if (settings.offlineUser.permissions.indexOf(permission) !== -1) {
        next();
        return;
      }
      res.sendStatus(403);
    };
  }

  // Check Auth0 permissions.
  return (req, res, next) => {
    if (
      req.user &&
      req.user.app_metadata &&
      req.user.app_metadata.authorization &&
      req.user.app_metadata.authorization.permissions &&
      req.user.app_metadata.authorization.permissions.indexOf(permission) !== -1
    ) {
      next();
      return;
    }
    res.sendStatus(403);
  };
}

export {
  permissionRequired
}

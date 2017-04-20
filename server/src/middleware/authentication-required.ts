import * as express from 'express';
import * as jwt from 'express-jwt';
import { settings } from '../settings';

function authenticationRequired(): express.RequestHandler {
  if (settings.offlineUser.enabled) {
    return (req, res, next) => {
      req.user = {
        user_id: settings.offlineUser.id,
        name: settings.offlineUser.name
      };
      next();
    };
  }

  // Authenticate based on JWT.
  return (req, res, next) => {
    jwt(settings.jwt)(req, res, next);
  };
}

export {
  authenticationRequired
}

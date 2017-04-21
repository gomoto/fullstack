import * as express from 'express';
import * as jwt from 'express-jwt';
import { settings } from '../settings';

function authenticationRequired(): express.RequestHandler {
  if (settings.offlineUser.enabled) {
    // Middleware that adds user to request object.
    return (req, res, next) => {
      req.user = settings.offlineUser.user;
      next();
    };
  }

  // Middleware that authenticates user based on JWT.
  return (req, res, next) => {
    jwt(settings.jwt)(req, res, next);
  };
}

export {
  authenticationRequired
}

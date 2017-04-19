import * as express from 'express';
import * as jwt from 'express-jwt';
import { settings } from '../settings';

function authenticationRequired(): express.RequestHandler {
  return (req, res, next) => {
    jwt(settings.jwt)(req, res, next);
  };
}

export {
  authenticationRequired
}

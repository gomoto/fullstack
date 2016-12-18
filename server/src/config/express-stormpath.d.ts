/// <reference types="express" />

import * as express from 'express';



// Add stormpath-specific properties to express request object.
declare global {
  namespace Express {
    export interface Request {
      user: stormpath.StormpathUser;
      isAdmin: boolean;
    }
  }
}



declare namespace stormpath {

  interface ExpressStormpath {
    groupsRequired(groups: string[], all?: boolean): express.RequestHandler;
    init(app: express.Application, options: any): express.Router;
    loginRequired: express.RequestHandler;
  }

  interface StormpathGroup {
    name: string;
  }

  interface StormpathUser {
    email: string;
    getGroups(callback: (error: any, groups: StormpathGroups) => void): void;
  }

  interface StormpathGroups {
    each: StormpathGroupsIterator;
  }

  interface StormpathGroupsIterator {
    (each: StormpathGroupsIteratorEach, done: StormpathGroupsIteratorDone): void;
  }

  interface StormpathGroupsIteratorEach {
    (group: StormpathGroup, nextGroup: () => void): void;
  }

  interface StormpathGroupsIteratorDone {
    (): void;
  }

}



export = stormpath;

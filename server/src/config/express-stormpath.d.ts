/// <reference types="express" />

import * as express from 'express';



// Add stormpath-specific properties to express request object.
declare global {
  namespace Express {
    export interface Request {
      user: stormpath.User;
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

  interface Group {
    name: string;
  }

  interface User {
    email: string;
    getGroups(callback: (error: any, groups: Groups) => void): void;
  }

  interface Groups {
    each: GroupsIterator;
  }

  interface GroupsIterator {
    (each: GroupsIteratorEach, done: GroupsIteratorDone): void;
  }

  interface GroupsIteratorEach {
    (group: Group, nextGroup: () => void): void;
  }

  interface GroupsIteratorDone {
    (): void;
  }

}



export = stormpath;

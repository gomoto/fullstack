// Add stormpath-specific properties to express request object.
declare namespace Express {
  export interface Request {
    user: StormpathUser;
    isAdmin: boolean;
  }
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

interface StormpathGroup {
  name: string;
}

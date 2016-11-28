/**
 * Inspired by stormpath.groupsRequired
 *
 * Factory function for an express middlware that asserts a user be a member of
 * at least one of the specified stormpath groups before allowing the user to
 * continue.
 *
 * If the user does not meet the group requirements, respond with 403.
 *
 * WARNING: This middleware does not check stormpath authentication!
 * Use the stormpath.loginRequired middleware before this one.
 *
 * @param {string[]} groups - A list of groups in one of which the user must be.
 *
 * @returns {Function} Returns an express middleware which asserts a user's
 *   group membership, and only allows the user to continue if the assertions
 *   are true.
 */

import express = require('express');

export default (groups: string[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const logger = req.app.get('stormpathLogger');
    const respondUnauthorized = (req: express.Request, res: express.Response) => {
      res.status(403).end();
    };

    var safe = false;
    req.user.getGroups((err, userGroups) => {
      if (err) {
        logger.info('Could not fetch user ' + req.user.email + '\'s groups.');
        return respondUnauthorized(req, res);
      }

      // Iterate through each group on the user's account, checking to see
      // whether or not it's one of the required groups.
      userGroups.each((group: StormpathGroup, nextGroup: Function) => {
        if (groups.indexOf(group.name) > -1) {
          safe = true;
        }
        if (group.name === process.env.ADMIN_GROUP) {
          req.isAdmin = true;
        }
        nextGroup();
      },
      // If we get here, it means the user didn't meet the requirements.
      () => {
        if (!safe) {
          logger.info('User ' + req.user.email + ' attempted to access a protected endpoint but did not meet the group check requirements.');
          return respondUnauthorized(req, res);
        }
        next();
      });
    });
  };
};

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  upsert
 * DELETE  /api/things/:id          ->  destroy
 */

import express = require('express');
import { ThingModel, ThingModelFactory } from './thing.model';

class ThingController {
  private model: ThingModel;

  constructor() {
    this.model = ThingModelFactory();
  }

  // Gets a list of Things
  public index(req: express.Request, res: express.Response) {
    const user_id = (req.user && req.user.user_id) || null;
    this.model.findAllForUser(user_id)
    .then(this.respondWithResult(res, 200))
    .catch(this.handleError(res));
    // return Thing.find().exec()
    //   .then(respondWithResult(res))
    //   .catch(handleError(res));
  }

  // Gets a single Thing from the DB
  public show(req: express.Request, res: express.Response) {
    // return Thing.findById(req.params.id).exec()
    //   .then(handleEntityNotFound(res))
    //   .then(respondWithResult(res))
    //   .catch(handleError(res));
  }

  // Creates a new Thing in the DB
  public create(req: express.Request, res: express.Response) {
    const user_id = (req.user && req.user.user_id) || null;
    if (!user_id) {
      this.handleError(res, 400);
      return;
    }
    return this.model.createForUser(user_id, req.body)
      .then(this.respondWithResult(res, 201))
      .catch(this.handleError(res));
  }

  // Upserts the given Thing in the DB at the specified ID
  public upsert(req: express.Request, res: express.Response) {
    // if(req.body._id) {
    //   delete req.body._id;
    // }
    // return Thing.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    //
    //   .then(respondWithResult(res))
    //   .catch(handleError(res));
  }

  // Deletes a Thing from the DB
  public destroy(req: express.Request, res: express.Response) {
    // return Thing.findById(req.params.id).exec()
    //   .then(handleEntityNotFound(res))
    //   .then(removeEntity(res))
    //   .catch(handleError(res));
  }

  private respondWithResult(res: express.Response, statusCode: number) {
    statusCode = statusCode || 200;
    return (entity: any) => {
      if(entity) {
        return res.status(statusCode).json(entity);
      }
      return null;
    };
  }

  private removeEntity(res: express.Response) {
    // return function(entity) {
    //   if(entity) {
    //     return entity.remove()
    //       .then(() => {
    //         res.status(204).end();
    //       });
    //   }
    // };
  }

  private handleEntityNotFound(res: express.Response) {
    // return function(entity) {
    //   if(!entity) {
    //     res.status(404).end();
    //     return null;
    //   }
    //   return entity;
    // };
  }

  private handleError(res: express.Response, statusCode?: number) {
    statusCode = statusCode || 500;
    return (err: any) => {
      res.status(statusCode).send(err);
    };
  }
}

function ThingControllerFactory (): ThingController {
  return new ThingController();
}

export {
  ThingController,
  ThingControllerFactory,
}

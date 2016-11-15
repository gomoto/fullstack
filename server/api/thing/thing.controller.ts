/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  upsert
 * DELETE  /api/things/:id          ->  destroy
 */

import express = require('express');
// import Thing from './thing.model';

function respondWithResult(res: express.Response, statusCode: number) {
  // statusCode = statusCode || 200;
  // return function(entity) {
  //   if(entity) {
  //     return res.status(statusCode).json(entity);
  //   }
  //   return null;
  // };
}

function removeEntity(res: express.Response) {
  // return function(entity) {
  //   if(entity) {
  //     return entity.remove()
  //       .then(() => {
  //         res.status(204).end();
  //       });
  //   }
  // };
}

function handleEntityNotFound(res: express.Response) {
  // return function(entity) {
  //   if(!entity) {
  //     res.status(404).end();
  //     return null;
  //   }
  //   return entity;
  // };
}

function handleError(res: express.Response, statusCode: number) {
  // statusCode = statusCode || 500;
  // return function(err) {
  //   res.status(statusCode).send(err);
  // };
}

// Gets a list of Things
export function index(req: express.Request, res: express.Response) {
  // return Thing.find().exec()
  //   .then(respondWithResult(res))
  //   .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req: express.Request, res: express.Response) {
  // return Thing.findById(req.params.id).exec()
  //   .then(handleEntityNotFound(res))
  //   .then(respondWithResult(res))
  //   .catch(handleError(res));
}

// Creates a new Thing in the DB
export function create(req: express.Request, res: express.Response) {
  // return Thing.create(req.body)
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));
}

// Upserts the given Thing in the DB at the specified ID
export function upsert(req: express.Request, res: express.Response) {
  // if(req.body._id) {
  //   delete req.body._id;
  // }
  // return Thing.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
  //
  //   .then(respondWithResult(res))
  //   .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req: express.Request, res: express.Response) {
  // return Thing.findById(req.params.id).exec()
  //   .then(handleEntityNotFound(res))
  //   .then(removeEntity(res))
  //   .catch(handleError(res));
}

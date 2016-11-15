'use strict';

import proxyquire = require('proxyquire');
import sinon = require('sinon');

var thingCtrlStub = {
  index: 'thingCtrl.index',
  show: 'thingCtrl.show',
  create: 'thingCtrl.create',
  upsert: 'thingCtrl.upsert',
  patch: 'thingCtrl.patch',
  destroy: 'thingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var thingIndex = proxyquire.noPreserveCache()('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './thing.controller': thingCtrlStub
});

describe('Thing API Router:', function() {
  it('should return an express router instance', function() {
    thingIndex.should.equal(routerStub);
  });

  describe('GET /api/things', function() {
    it('should route to thing.controller.index', function() {
      routerStub.get
        .withArgs('/', 'thingCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/things/:id', function() {
    it('should route to thing.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'thingCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/things', function() {
    it('should route to thing.controller.create', function() {
      routerStub.post
        .withArgs('/', 'thingCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/things/:id', function() {
    it('should route to thing.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'thingCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/things/:id', function() {
    it('should route to thing.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'thingCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/things/:id', function() {
    it('should route to thing.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'thingCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});

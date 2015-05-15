// eslint no-unused-expressions: 0

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var CP = require('child_process');
var Path = require('path');
var Sinon = require('sinon');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;


var server;

describe('PUT /trees/{id}/grow', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });
  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });
  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should effect the tree', function(done){
    server.inject({method: 'PUT', url: '/trees/a000a000a000a000a000a000/grow', credentials: {_id: 'a12345678901234567890012'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.height).to.be.within(1, 6);
      expect(response.result.health).to.be.within(90, 100);
      done();
    });
  });
  it('should damage a tree', function(done){
    var stub = Sinon.stub(Math, 'random');
    stub.onCall(0).returns(0).onCall(1).returns(0.9);
    server.inject({method: 'PUT', url: '/trees/a000a000a000a000a000a000/grow', credentials: {_id: 'a12345678901234567890012'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.health).to.equal(91);
      stub.restore();
      done();
    });
  });
  it('should grow a tree', function(done){
    var stub = Sinon.stub(Math, 'random');
    stub.onCall(0).returns(0.99).onCall(1).returns(0.6);
    server.inject({method: 'PUT', url: '/trees/a000a000a000a000a000a000/grow', credentials: {_id: 'a12345678901234567890012'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.height).to.equal(4);
      stub.restore();
      done();
    });
  });
});

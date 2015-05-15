/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var CP = require('child_process');
var Path = require('path');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var Tree = require('../../../../lib/models/tree');


var server;

describe('DELETE /trees/{id}', function(){
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
  it('should remove the tree', function(done){
    server.inject({method: 'DELETE', url: '/trees/f000a000a000a000a000a000', credentials: {_id: 'a12345678901234567890013'}}, function(response){
      expect(response.statusCode).to.equal(200);
      Tree.findOne({_id: 'f000a000a000a000a000a000'}, function(tree){
        expect(tree).to.equal(null);
      });
      done();
    });
  });
  it("should not remove someone else's tree", function(done){
    server.inject({method: 'DELETE', url: '/trees/a000a000a000a000a000a000', credentials: {_id: 'a12345678901234567890013'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response._id).to.not.be.ok;
      done();
    });
  });
});

'use strict';

var Tree = require('../../../models/tree');

exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/trees/{id}',
    config: {
      description: 'Destroy a tree',
      handler: function(request, reply){
        Tree.findByIdAndRemove(request.params.id, function(tree){
          return reply(tree);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.destroy'
};

'use strict';

var Tree = require('../../../models/tree');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/trees/{id}/grow',
    config: {
      validate: {
        params: {
          id: Joi.string().hex().length(24).required()
        }
      },
      description: 'Grow a tree, perhaps',
      handler: function(request, reply){
        Tree.findOne({ownerId: request.auth.credentials._id, _id: request.params.id}, function(err, tree){
          var max = 2500;
          var height = tree.height;
          var odds = height / max;
          var roll = Math.random();
          if(roll < odds){
            // damage
            tree.health -= Math.floor(Math.random() * 11);
          } else{
            // grow
            tree.height += Math.floor(Math.random() * 6);
          }
          tree.save(function(){
            return reply(tree);
          });
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.grow'
};

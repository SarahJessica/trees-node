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
          if(err){return reply().code(400); }
          var max = 2500;
          var height = tree.height;
          var odds;
          if(height > 2250){
            odds = 0.9;
          } else{
            odds = height / max;
          }
          var roll = Math.random();
          if(roll < odds){
            // damage
            tree.health -= Math.floor(Math.random() * 11);
          } else{
            // grow
            var addAmt = Math.floor(Math.random() * 6);
            if(tree.height + addAmt > 2500){
              tree.height = 2500;
            }else{
              tree.height += addAmt;
            }
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

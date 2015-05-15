/* eslint no-reserved-keys: 0 */

'use strict';

var Mongoose = require('mongoose');
var Tree;

var treeSchema = Mongoose.Schema({
  height: {type: Number, required: true, default: 1},
  createdAt: {type: Date, required: true, default: Date.now},
  health: {type: Number, required: true, default: 100},
  ownerId: {type: Mongoose.Schema.ObjectId, ref: 'User', required: true}
});

Tree = Mongoose.model('Tree', treeSchema);
module.exports = Tree;

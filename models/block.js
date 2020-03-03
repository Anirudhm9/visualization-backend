var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../config');

var block = new Schema({
  blocks: [
    {
      child: {
        id: { type: String },
        type: { type: String },
        color: { type: String },
        value: { type: String },
      },
      parent: {
        id: { type: String },
        type: { type: String },
        color: { type: String },
        value: { type: String },
      }
    }
  ]
});

module.exports = mongoose.model('block', block);
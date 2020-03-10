var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../config');

var block = new Schema({
  workSpaceName: { type: String, trim: true },
  blocks: [
    {
      child: {
        id: { type: String },
        type: { type: String },
        author: { tpye: String, default: '' },
        review: { tpye: String, default: '' },
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
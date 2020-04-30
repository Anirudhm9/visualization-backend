var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../config');

var visualization = new Schema({
  config: {
    location: [
      {
        lat: { type: String },
        long: { type: String },
      }
    ],
    type: { type: String },
    date: { type: String },
    entities: [
      { type: String },
    ],
    order: [
      { type: String },
    ]
  },
  visualizations: {
    Clusters: { type: Boolean },
    Heatmap: { type: Boolean },
    Trajectory: { type: Boolean },
    '2D chart': { type: Boolean }
  },
  data: [
    { type: Object }
  ]
});

module.exports = mongoose.model('visualization', visualization);
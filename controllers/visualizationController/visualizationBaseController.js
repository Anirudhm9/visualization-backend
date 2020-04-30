var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var Service = require("../../services");
const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');

function equalsIgnoringCase(text, other) {
  return text.localeCompare(other, undefined, { sensitivity: 'base' }) === 0;
}


var getDataFromFile = function (callback) {
  var output;
  var DATA = [];
  const results = [];
  var visualizations = {
    'Clusters': false,
    'Heatmap': false,
    'Trajectory': false,
    '2D chart': false,

  };
  var payloadData = {
    allKeys: [
      'Latitude',
      'Longitude',
      'Latitude1',
      'Longitude1',
      'DATE',
      'TIME',
      'Weather',
      'Locality',
      'DEER',
      'DEAD'
    ],
    config: {
      location: [
        {
          lat: 'Latitude',
          long: 'Longitude'
        },
        {
          lat: 'Latitude1',
          long: 'Longitude1'
        }
      ],
      type: 'point',
      date: 'date',
      entities: [
        'TIME',
        'Locality',
        'Weather',
        'DEER',
        'DEAD'
      ],
      order: [
        'location',
        'time',
        'entity'
      ]
    }
  };
  async.series([
    function (cb) {
      if (payloadData.config.location.length === 1 && payloadData.config.location[0].lat && payloadData.config.location[0].long) {
        visualizations.Clusters = true;
      }
      if (payloadData.config.location.length === 1 && payloadData.config.location[0].lat && payloadData.config.location[0].long && payloadData.config.entities && payloadData.config.entities[0]) {
        visualizations.Heatmap = true;
      }
      if (payloadData.config.location.length > 1) {
        visualizations.Trajectory = true;
      }
      if (payloadData.config.entities.length > 1) {
        visualizations["2D chart"] = true;
      }
      cb();
    },
    function (cb) {
      fs.createReadStream('./controllers/visualizationController/Book1.csv')
        .pipe(csv())
        .on('data', (data) => DATA.push(data))
        .on('end', () => {
          var objToSave = payloadData;
          objToSave.data = [];
          objToSave.visualizations = visualizations;
          DATA = _.map(DATA, function (item) {
            let temp = _.pick(item, payloadData.allKeys);
            objToSave.data.push(temp);
          })

          Service.VisualizationService.createVisualization(objToSave, function (err, data) {
            if (err) cb(err)
            else {
              output = data;
              cb();
            }
          })
        });
    }
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null, { data: output })
  })
};

// for clusters 
// _.map(data, (item) => {
//   item[visualizations.Clusters.keysRequired.lat] 
//   item[visualizations.Clusters.keysRequired.long]
// })




module.exports = {
  getDataFromFile: getDataFromFile
};
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var Service = require("../../services");
const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');
var AWS = require('ibm-cos-sdk');
const fetch = require('node-fetch');
var CONFIG = require('../../config');
var Path = require('path');
var uploadManager = require('../../lib/uploadManager');
var ibms3Config = {
  endpoint: CONFIG.AWS_S3_CONFIG.s3BucketCredentials.endpoint,
  apiKeyId: CONFIG.AWS_S3_CONFIG.s3BucketCredentials.apiKeyId,
  serviceInstanceId: CONFIG.AWS_S3_CONFIG.s3BucketCredentials.serviceInstanceId
};
var s3 = new AWS.S3(ibms3Config);


function equalsIgnoringCase(text, other) {
  return text.localeCompare(other, undefined, { sensitivity: 'base' }) === 0;
}


var getDataFromFile = function (payloadData, callback) {
  var output;
  var final;
  var DATA = [];
  const results = [];
  var final = [];
  var startDate;
  var profileFolderUploadPath = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.projectFolder + "/docs";
  var path = Path.resolve("..") + "/uploads/" + profileFolderUploadPath + "/";
  var visualizations = {
    'Clusters': false,
    'Heatmap': false,
    'Trajectory': false,
    '2D chart': false,

  };
  async.series([
    function (cb) {
      if (payloadData.config.location.length === 1 && payloadData.config.location[0].lat && payloadData.config.location[0].long) {
        visualizations.Clusters = true;
      }
      if (payloadData.config.location.length === 1 && payloadData.config.location[0].lat && payloadData.config.location[0].long && payloadData.config.entities && payloadData.config.entities[0]) {
        visualizations.Heatmap = true;
      }
      if (payloadData.config.location.length === 1 && payloadData.config.location[0].lat && payloadData.config.location[0].long && payloadData.config.entities.length > 0) {
        visualizations.Trajectory = true;
      }
      if (payloadData.config.entities.length > 0) {
        visualizations["2D chart"] = true;
      }
      cb();
    },
    function (cb) {
      let url = payloadData.csvLink;
      var fileName = "files/docs/original/" + url.substring(url.lastIndexOf('/') + 1);
      var type = url.substring(url.lastIndexOf('.') + 1);
      var params = {
        Bucket: CONFIG.AWS_S3_CONFIG.s3BucketCredentials.bucket,
        Key: fileName
      }
      if (type === "csv") {
        s3.getObject(params, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            fileName = url.substring(url.lastIndexOf('/') + 1);
            fs.appendFile(path + fileName, new Buffer(data.Body.buffer), function (err) {
              if (err) {
                console.log(err);
              } else {
                fs.createReadStream(path + fileName)
                  .pipe(csv())
                  .on('data', (data) => DATA.push(data))
                  .on('end', () => {
                    var objToSave = payloadData;
                    objToSave.data = [];
                    objToSave.visualizations = visualizations;
                    _.map(DATA, function (item) {
                      let temp = _.pick(item, payloadData.allKeys);
                      objToSave.data.push(temp);
                    })
                    Service.VisualizationService.createVisualization(objToSave, function (err, data) {
                      if (err) cb(err)
                      else {
                        output = data;
                        uploadManager.deleteFile(path + fileName, cb);
                      }
                    })
                  });
              }
            });
          }
        });
      }
    },
    function (cb) {
      if (payloadData.config.date && payloadData.config.date !== undefined && payloadData.config.date !== '') {
        startDate = output.data[0] && output.data[0][output.config.date];
        output.data.forEach((item) => {
          if (new Date(startDate) > new Date(item[output.config.date])) {
            startDate = item[output.config.date];
          }
        });
      }
      cb();
    },
    function (cb) {
      Service.VisualizationService.getVisualization({ _id: output._id }, {}, function (err, data) {
        if (err) cb(err)
        else {
          final = data && data[0];
          final.data = data && data[0] && data[0].data && data[0].data[0];
          cb();
        }
      })
    }
    // function (cb) {
    //   if (payloadData.hasOwnProperty("startDate") && payloadData.startDate != "" & payloadData.startDate != undefined && payloadData.startDate != null && payloadData.hasOwnProperty("endDate") && payloadData.endDate != "" & payloadData.endDate != undefined && payloadData.endDate != null) {
    //     if (output.config.date && output.config.date !== undefined && output.config.date !== '') {
    //       final = _.filter(output.data, (item) => {
    //         if (new Date(item[output.config.date]) >= new Date(payloadData.startDate) && new Date(item[output.config.date]) < new Date(payloadData.endDate)) {
    //           return item;
    //         }
    //       })
    //       console.log('>>>>>>>>>>', final);
    //       output.data = final;
    //       cb();
    //     }
    //     else {
    //       cb(ERROR.INVALID_DATE_KEY);
    //     }
    //   }
    //   else {
    //     cb();
    //   }
    // }
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null, { data: final, startDate: startDate })
  })
};


var getFieldNames = function (payloadData, callback) {
  var output = [];
  var DATA = [];
  var profileFolderUploadPath = CONFIG.AWS_S3_CONFIG.s3BucketCredentials.projectFolder + "/docs";
  var path = Path.resolve("..") + "/uploads/" + profileFolderUploadPath + "/";
  async.series([
    function (cb) {
      let url = payloadData.csvLink;
      var fileName = "files/docs/original/" + url.substring(url.lastIndexOf('/') + 1);
      var type = url.substring(url.lastIndexOf('.') + 1);
      var params = {
        Bucket: CONFIG.AWS_S3_CONFIG.s3BucketCredentials.bucket,
        Key: fileName
      }
      if (type === "csv") {
        s3.getObject(params, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            fileName = url.substring(url.lastIndexOf('/') + 1);
            fs.appendFile(path + fileName, new Buffer(data.Body.buffer), function (err) {
              if (err) {
                console.log(err);
              } else {
                fs.createReadStream(path + fileName)
                  .pipe(csv())
                  .on('data', (data) => DATA.push(data))
                  .on('end', () => {
                    if (DATA.length > 0) {
                      output = Object.keys(DATA[0]);
                    }
                    uploadManager.deleteFile(path + fileName, cb);
                  });
              }
            });
          }
        });
      }
    }
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null, { data: output })
  })
};

var getDataByDate = function (payloadData, callback) {
  var output = [];
  var DATA = [];
  async.series([
    function (cb) {
      Service.VisualizationService.getVisualization({ csvLink: payloadData.csvLink }, {}, {}, function (err, data) {
        if (err) cb(err);
        else {
          DATA = data && data[0] || null;
          cb();
        }
      })
    },
    function (cb) {
      if (DATA.config.date && DATA.config.date !== undefined && DATA.config.date !== '') {
        output = _.filter(DATA.data, (item) => {
          if (new Date(item[DATA.config.date]) > new Date(payloadData.startDate) && new Date(item[DATA.config.date]) <= new Date(payloadData.endDate)) {
            return item;
          }
        })
        DATA.data = output;
        cb();
      }
      else {
        cb(ERROR.INVALID_DATE_KEY);
      }
    },
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null, { data: DATA })
  })
};

var getFilteredData = function (payloadData, callback) {
  var output = [];
  var vizData;
  var dataSets = {
    // Clusters: [],
    // Heatmap: [],
    // Trajectory: [],
    // '2D chart': []
  };
  var DATA = [];
  var clusterData = [];
  var heatmapData = [];
  var trajecory = [];
  var chart = [];
  var filters = {
    Clusters: [],
    Heatmap: [],
    Trajectory: [],
    '2D chart': []
  }
  async.series([

    // function (cb) {
    //   Service.VisualizationService.getVisualization({ csvLink: payloadData.csvLink }, { visualizations: 1 }, { $natural: -1 }, function (err, data) {
    //     if (err) cb(err)
    //     else {
    //       console.log(data && data[0] && data[0].visualizations, '}{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}')
    //       data !== undefined && data && data[0] !== undefined && data[0] && data[0].visualizations !== undefined && data[0].visualizations && Object.keys(data[0].visualizations).map(item => {
    //         if (data[0][item]) {
    //           dataSets[item] = [];
    //         }
    //       })
    //       console.log('?????????????', data[0].visualizations)
    //       cb();
    //     }
    //   })
    // },
    function (cb) {
      if (payloadData.hasOwnProperty("entities") && payloadData.entities != undefined && payloadData.entities.length > 0 && payloadData.entities != null) {
        payloadData.entities.forEach(element => {
          Object.keys(filters).forEach(item => {
            if (element.visualizations[item]) {
              filters[item].push({ entityName: element.entityName, entityValue: element.entityValue });
            }
          })
        });
      }
      cb();
    },


    function (cb) {
      var filterArray = Object.keys(payloadData.selectedVisualizations);
      var taskInParallel = [];
      for (var key in filterArray) {
        if (payloadData.selectedVisualizations[filterArray[key]]) {
          (function (key) {
            taskInParallel.push((function (key) {
              return function (embeddedCB) {

                var criteria = [
                  {
                    $match: {
                      csvLink: payloadData.csvLink,
                      workspace: payloadData.workspace
                    }
                  }
                ];
                if ((payloadData.hasOwnProperty("entities") && filters[filterArray[key]] != undefined && filters[filterArray[key]].length > 0 && filters[filterArray[key]] != null && payloadData.hasOwnProperty("uniqueEntity") && payloadData.uniqueEntity != "" & payloadData.uniqueEntity != undefined && payloadData.uniqueEntity != null)) {
                  criteria.push({
                    $unwind: '$data'
                  });
                  let query = {
                    $match: {
                      $or: []
                    }
                  };
                  filters[filterArray[key]].forEach(element => {
                    let keyName = 'data.' + element.entityName;
                    query.$match.$or.push({
                      [keyName]: element.entityValue,
                    });
                  });
                  criteria.push(query);
                  criteria.push(
                    {
                      $group: {
                        _id: '$data.' + payloadData.uniqueEntity,
                        data: { $push: '$data' },
                      }
                    }
                  );
                }
                else {
                  if (payloadData.hasOwnProperty("entities") && filters[filterArray[key]] != undefined && filters[filterArray[key]].length > 0 && filters[filterArray[key]] != null) {
                    criteria.push({
                      $unwind: '$data'
                    });
                    let query = {
                      $match: {
                        $or: []
                      }
                    };
                    filters[filterArray[key]].forEach(element => {
                      let keyName = 'data.' + element.entityName;
                      query.$match.$or.push({
                        [keyName]: element.entityValue,
                      });
                    });
                    criteria.push(query);
                    criteria.push(
                      {
                        $group: {
                          _id: null,
                          data: { $push: '$data' },
                        }
                      }
                    )
                  }
                  if (payloadData.hasOwnProperty("uniqueEntity") && payloadData.uniqueEntity != "" & payloadData.uniqueEntity != undefined && payloadData.uniqueEntity != null) {
                    criteria.push({
                      $unwind: '$data'
                    });
                    criteria.push(
                      {
                        $group: {
                          _id: '$data.' + payloadData.uniqueEntity,
                          data: { $push: '$data' },
                        }
                      }
                    );
                  }
                }
                Service.VisualizationService.getAggregateVisualization(criteria, function (err, data) {
                  if (err) embeddedCB(err);
                  else {
                    DATA = data || null;

                    if (payloadData.hasOwnProperty("date") && payloadData.date != undefined && payloadData.date != null && payloadData.date != '' && payloadData.hasOwnProperty("startDate") && payloadData.startDate != undefined && payloadData.startDate != null && payloadData.startDate != '' && payloadData.hasOwnProperty("endDate") && payloadData.endDate != undefined && payloadData.endDate != null && payloadData.endDate != '') {
                      if ((payloadData.hasOwnProperty("uniqueEntity") && payloadData.uniqueEntity != "" & payloadData.uniqueEntity != undefined && payloadData.uniqueEntity != null) || (payloadData.hasOwnProperty("entities") && payloadData.entities != undefined && payloadData.entities.length > 0 && payloadData.entities != null)) {
                        DATA.forEach(element => {
                          output = _.filter(element.data, (item) => {
                            if (new Date(item[payloadData.date]) > new Date(payloadData.startDate) && new Date(item[payloadData.date]) <= new Date(payloadData.endDate)) {
                              return item;
                            }
                          })
                          var index = DATA.indexOf(element);
                          DATA[index].data = output;
                        });
                        dataSets[filterArray[key]] = DATA;
                        embeddedCB();
                      }
                      else {
                        if (DATA && DATA.length > 0) {
                          DATA = DATA[0];
                        }
                        if (DATA.config.date && DATA.config.date !== undefined && DATA.config.date !== '') {
                          output = _.filter(DATA.data, (item) => {
                            if (new Date(item[DATA.config.date]) > new Date(payloadData.startDate) && new Date(item[DATA.config.date]) <= new Date(payloadData.endDate)) {
                              return item;
                            }
                          })
                          DATA.data = output;
                          dataSets[filterArray[key]] = DATA;
                          embeddedCB();
                        }
                        else {
                          embeddedCB(ERROR.INVALID_DATE_KEY);
                        }
                      }
                    }
                    else {
                      dataSets[filterArray[key]] = DATA;
                      embeddedCB();
                    }
                  }
                })
              }
            })(key))
          }(key));
        }
        else {
          dataSets[filterArray[key]] = [];
        }
      }
      async.parallel(taskInParallel, function (err, result) {
        cb(null);
      });
    },
    function (cb) {
      if ((payloadData.hasOwnProperty("uniqueEntity") && payloadData.uniqueEntity != "" & payloadData.uniqueEntity != undefined && payloadData.uniqueEntity != null) && payloadData.selectedVisualizations.Trajectory) {
        Service.VisualizationService.getVisualization({ csvLink: payloadData.csvLink, workspace: payloadData.workspace }, {}, {}, function (err, data) {
          if (err) cb(err)
          else {
            console.log('!!!!!!!!!', data)
            vizData = data && data[0] || null;
            cb();
          }
        })
      }
      else {
        cb();
      }
    },
    function (cb) {
      if (vizData && vizData.config.location && vizData.config.location[0]) {
        let temp = [];
        dataSets.Trajectory.forEach(element => {
          let tempObject = { latLongs: [], };
          element && element.data && element.data.forEach(item => {
            console.log(item, '<<<<<<<<', vizData.config.location[0])
            let latLongs = [item[vizData.config.location[0].lat], item[vizData.config.location[0].long]];
            tempObject.latLongs.push(latLongs);
            tempObject[payloadData.uniqueEntity] = item[payloadData.uniqueEntity];
          })
          temp.push(tempObject);
        });
        dataSets.Trajectory = temp;
        cb();
      }
      else {
        cb();
      }
    }
    // function (cb) {
    //   if (payloadData.hasOwnProperty("date") && payloadData.date != undefined && payloadData.date != null && payloadData.date != '' && payloadData.hasOwnProperty("startDate") && payloadData.startDate != undefined && payloadData.startDate != null && payloadData.startDate != '' && payloadData.hasOwnProperty("endDate") && payloadData.endDate != undefined && payloadData.endDate != null && payloadData.endDate != '') {
    //     if ((payloadData.hasOwnProperty("uniqueEntity") && payloadData.uniqueEntity != "" & payloadData.uniqueEntity != undefined && payloadData.uniqueEntity != null) || (payloadData.hasOwnProperty("entities") && payloadData.entities != undefined && payloadData.entities.length > 0 && payloadData.entities != null)) {
    //       DATA.forEach(element => {
    //         output = _.filter(element.data, (item) => {
    //           if (new Date(item[payloadData.date]) > new Date(payloadData.startDate) && new Date(item[payloadData.date]) <= new Date(payloadData.endDate)) {
    //             return item;
    //           }
    //         })
    //         var index = DATA.indexOf(element);
    //         DATA[index].data = output;
    //       });
    //       cb();
    //     }
    //     else {
    //       if (DATA && DATA.length > 0) {
    //         DATA = DATA[0];
    //       }
    //       if (DATA.config.date && DATA.config.date !== undefined && DATA.config.date !== '') {
    //         output = _.filter(DATA.data, (item) => {
    //           if (new Date(item[DATA.config.date]) > new Date(payloadData.startDate) && new Date(item[DATA.config.date]) <= new Date(payloadData.endDate)) {
    //             return item;
    //           }
    //         })
    //         DATA.data = output;
    //         cb();
    //       }
    //       else {
    //         cb(ERROR.INVALID_DATE_KEY);
    //       }
    //     }
    //   }
    //   else {
    //     cb();
    //   }
    // },
    // function (cb) {

    // }
    // , function (cb) {
    //   dataSets["2D chart"] = [];
    //   dataSets.Heatmap = [];
    //   dataSets.Trajectory = [];
    //   cb();
    // }
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null, { data: dataSets })
  })
};



module.exports = {
  getDataFromFile: getDataFromFile,
  getFieldNames: getFieldNames,
  getDataByDate: getDataByDate,
  getFilteredData: getFilteredData
};
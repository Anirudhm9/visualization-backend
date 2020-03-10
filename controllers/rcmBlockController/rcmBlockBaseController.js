var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var Service = require("../../services");

var createBlock = function (payloadData, callback) {
  var dataToSave;
  async.series([
    function (cb) {
      console.log((payloadData.blocks));
      dataToSave = (payloadData);
      cb()
    },
    function (cb) {
      Service.BlockService.createBlock(dataToSave, function (err, data) {
        if (err) cb(err)
        else {
          cb();
        }
      })
    }
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null)
  })
};

var getSpecificBlocks = function (payloadData, callback) {
  var output = { blocks: [] };
  async.series([
    function (cb) {
      if (payloadData.blockId.length == 1) {
        Service.BlockService.getBlock({ _id: payloadData.blockId[0] }, { __v: 0 }, {}, function (err, data) {
          if (err) cb(err)
          else {
            if (data.length == 0) {
              output = [];
            }
            else {
              output = data && data[0] || null;
            }
            cb();
          }
        })
      }
      else {
        var taskInParallel = [];
        for (var key in payloadData.blockId) {
          (function (key) {
            taskInParallel.push((function (key) {
              return function (embeddedCB) {
                Service.BlockService.getBlock({ _id: payloadData.blockId[key] }, {}, {}, function (err, data) {
                  if (err) cb(err)
                  else {
                    data[0].blocks.forEach(element => {
                      output.blocks.push(element)
                    });
                    embeddedCB()
                  }
                })
              }
            })(key))
          }(key));
        }
        async.parallel(taskInParallel, function (err, result) {
          cb(null);
        });
      }
    }
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null, output)
  })
};

var getAllBlocks = function (callback) {
  var output;
  async.series([
    function (cb) {
      Service.BlockService.getBlock({}, { __v: 0 }, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) {
            output = [];
          }
          else {
            output = data || null;
          }
          cb();
        }
      })
    }
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null, output)
  })
};

var updateBlock = function (payloadData, callback) {
  var output;
  async.series([
    function (cb) {
      var criteria = {
        _id: payloadData.blockId,
      }
      var dataToSet = {};
      if (payloadData.review != '') {
        dataToSet = {
          $set: {
            'blocks.$[p].child.review': payloadData.review
          }
        }
      }
      if (payloadData.author != '') {
        dataToSet = {
          $set: {
            'blocks.$[p].child.author': payloadData.author
          }
        }
      }
      else {
        dataToSet = {
          $set: {
            'blocks.$[p].child.review': payloadData.review,
            'blocks.$[p].child.author': payloadData.author
          }
        }
      }
      var options = { "arrayFilters": [{ "p._id": payloadData.arrayItemId }] }
      Service.BlockService.updateBlock(criteria, dataToSet, options, function (err, data) {
        if (err) cb(err)
        else {
          cb();
        }
      })
    },
    function (cb) {
      Service.BlockService.getBlock({ _id: payloadData.blockId }, { __v: 0 }, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) {
            output = [];
          }
          else {
            output = data && data[0] || null;
          }
          cb();
        }
      })
    }
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null, output)
  })
};

var deleteBlock = function (payloadData, callback) {
  var output;
  async.series([
    function (cb) {
      var criteria = {
        _id: payloadData.blockId,
      }
      Service.BlockService.deleteBlock(criteria, function (err, data) {
        if (err) cb(err)
        else {
          cb();
        }
      })
    }
  ], function (error, result) {
    if (error) return callback(error);
    else return callback(null)
  })
};

module.exports = {
  createBlock: createBlock,
  getSpecificBlocks: getSpecificBlocks,
  updateBlock: updateBlock,
  getAllBlocks: getAllBlocks,
  deleteBlock: deleteBlock
};
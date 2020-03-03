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

var getBlock = function (callback) {
  var output;
  async.series([
    function (cb) {
      Service.BlockService.getBlock({}, { _id: 0, __v: 0 }, {}, function (err, data) {
        if (err) cb(err)
        else {
          if (data.length == 0) {
            output = [];
          }
          else {
            output = data && data[0].blocks || null;
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

module.exports = {
  createBlock: createBlock,
  getBlock: getBlock
};
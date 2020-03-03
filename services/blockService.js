"use strict";

var Models = require("../models");

var updateBlock = function (criteria, dataToSet, options, callback) {
  options.lean = true;
  options.new = true;
  Models.Block.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var createBlock = function (objToSave, callback) {
  new Models.Block(objToSave).save(callback);
};

var deleteBlock = function (criteria, callback) {
  Models.Block.findOneAndRemove(criteria, callback);
};

var getBlock = function (criteria, projection, options, callback) {
  options.lean = true;
  Models.Block.find(criteria, projection, options, callback).limit(1).sort({ $natural: -1 });
};

var getBlockPromise = function (criteria, projection, options) {
  options.lean = true;
  return new Promise((resolve, reject) => {
    Models.Block.find(criteria, projection, options, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
module.exports = {
  updateBlock: updateBlock,
  createBlock: createBlock,
  deleteBlock: deleteBlock,
  getBlock: getBlock,
  getBlockPromise: getBlockPromise
};

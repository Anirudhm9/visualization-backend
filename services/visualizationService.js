"use strict";

var Models = require("../models");

var updateVisualization = function (criteria, dataToSet, options, callback) {
  options.lean = true;
  options.new = true;
  Models.Visualization.findOneAndUpdate(criteria, dataToSet, options, callback);
};

var createVisualization = function (objToSave, callback) {
  new Models.Visualization(objToSave).save(callback);
};

var deleteVisualization = function (criteria, callback) {
  Models.Visualization.findOneAndRemove(criteria, callback);
};

var getVisualization = function (criteria, projection, options, callback) {
  options.lean = true;
  Models.Visualization.find(criteria, projection, options, callback).sort({ $natural: -1 });
};

module.exports = {
  updateVisualization: updateVisualization,
  createVisualization: createVisualization,
  deleteVisualization: deleteVisualization,
  getVisualization: getVisualization,
};

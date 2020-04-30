var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

var getDataFromFile = {
  method: "GET",
  path: "/api/visualization/getDataFromFile",
  handler: function (request, h) {
    return new Promise((resolve, reject) => {
      Controller.VisualizationBaseController.getDataFromFile(function (
        err,
        data
      ) {
        if (err) {
          reject(UniversalFunctions.sendError(err));
        } else {
          resolve(
            UniversalFunctions.sendSuccess(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                .CREATED,
              data
            )
          );
        }
      });
    });
  },
  config: {
    description: "Get data from file",
    tags: ["api", "visualization"],
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var VisualizationRoute = [
  getDataFromFile
];
module.exports = VisualizationRoute;
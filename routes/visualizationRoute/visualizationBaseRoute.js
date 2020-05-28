var UniversalFunctions = require("../../utils/universalFunctions");
var Controller = require("../../controllers");
var Joi = require("joi");
var Config = require("../../config");

var getDataFromFile = {
  method: "POST",
  path: "/api/visualization/getDataFromFile",
  handler: function (request, h) {
    return new Promise((resolve, reject) => {
      Controller.VisualizationBaseController.getDataFromFile(request.payload, function (
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
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        csvLink: Joi.string().required(),
        workspace: Joi.string().required(),
        allKeys: Joi.array().items([Joi.string()]),
        config: Joi.object().keys(
          {
            location: Joi.array().items(
              Joi.object().keys(
                {
                  lat: Joi.string(),
                  long: Joi.string()
                }
              )
            ).optional().allow([]),
            date: Joi.string().optional().allow(''),
            entities: Joi.array().items(Joi.string()).optional().allow([]),
            order: Joi.array().items([Joi.string()]).optional().allow([]),
            type: Joi.string().optional().allow(''),
          }
        )
      }
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var getFieldNames = {
  method: "POST",
  path: "/api/visualization/getFieldNames",
  handler: function (request, h) {
    return new Promise((resolve, reject) => {
      Controller.VisualizationBaseController.getFieldNames(request.payload, function (
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
    description: "Get fields from file",
    tags: ["api", "visualization"],
    validate: {
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        csvLink: Joi.string().required(),
      }
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var getDataByDate = {
  method: "POST",
  path: "/api/visualization/getDataByDate",
  handler: function (request, h) {
    return new Promise((resolve, reject) => {
      Controller.VisualizationBaseController.getDataByDate(request.payload, function (
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
    description: "Get fields from file",
    tags: ["api", "visualization"],
    validate: {
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        csvLink: Joi.string().required(),
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
      }
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

var getFilteredData = {
  method: "POST",
  path: "/api/visualization/getFilteredData",
  handler: function (request, h) {
    return new Promise((resolve, reject) => {
      Controller.VisualizationBaseController.getFilteredData(request.payload, function (
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
    description: "Get filtered data from file",
    tags: ["api", "visualization"],
    validate: {
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        csvLink: Joi.string().required(),
        workspace: Joi.string().required(),
        uniqueEntity: Joi.string().optional().allow(''),
        selectedVisualizations: Joi.object().keys({
          Clusters: Joi.boolean().required(),
          Heatmap: Joi.boolean().required(),
          Trajectory: Joi.boolean().required(),
          '2D chart': Joi.boolean().required()
        }),
        entities: Joi.array().items({
          entityName: Joi.string(),
          entityValue: Joi.string(),
          visualizations: Joi.object().keys({
            Clusters: Joi.boolean().required(),
            Heatmap: Joi.boolean().required(),
            Trajectory: Joi.boolean().required(),
            '2D chart': Joi.boolean().required()
          }
          )
        }).optional().allow([]),
        date: Joi.string().optional().allow(''),
        startDate: Joi.string().optional().allow(''),
        endDate: Joi.string().optional().allow(''),
      }
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
  getDataFromFile,
  getFieldNames,
  getDataByDate,
  getFilteredData
];
module.exports = VisualizationRoute;
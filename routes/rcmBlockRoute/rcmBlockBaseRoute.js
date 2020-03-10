var UniversalFunctions = require("../../utils/universalFunctions");
var Joi = require("joi");
var Config = require("../../config");
var Controller = require("../../controllers");

var createBlock = {
  method: "POST",
  path: "/api/rcm/createBlock",
  config: {
    description: "demo api",
    tags: ["api", "demo"],
    handler: function (request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        Controller.RcmBlockBaseController.createBlock(payloadData, function (
          err,
          data
        ) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        });
      });
    },
    validate: {
      payload: {
        workSpaceName: Joi.string().required(),
        blocks: Joi.array().required()
      },
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

var getBlock = {
  method: "POST",
  path: "/api/rcm/getBlock",
  config: {
    description: "demo api",
    tags: ["api", "demo"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controller.RcmBlockBaseController.getSpecificBlocks(request.payload, function (
          err,
          data
        ) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        });
      });
    },
    validate: {
      failAction: UniversalFunctions.failActionFunction,
      payload: {
        blockId: Joi.array().required()
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

var getAllBlocks = {
  method: "GET",
  path: "/api/rcm/getAllBlocks",
  config: {
    description: "Get All Blocks",
    tags: ["api", "demo"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controller.RcmBlockBaseController.getAllBlocks(function (
          err,
          data
        ) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        });
      });
    },
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

var updateBlock = {
  method: "PUT",
  path: "/api/rcm/updateBlock",
  config: {
    description: "Update a specific block",
    tags: ["api", "rcm"],
    handler: function (request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        Controller.RcmBlockBaseController.updateBlock(payloadData, function (
          err,
          data
        ) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        });
      });
    },
    validate: {
      payload: {
        blockId: Joi.string().required(),
        author: Joi.string().optional().allow(''),
        review: Joi.string().optional().allow(''),
        arrayItemId: Joi.string().required(),
      },
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

var deleteBlock = {
  method: "DELETE",
  path: "/api/rcm/deleteBlock",
  config: {
    description: "Delete block",
    tags: ["api", "rcm"],
    handler: function (request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        Controller.RcmBlockBaseController.deleteBlock(payloadData, function (
          err,
          data
        ) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        });
      });
    },
    validate: {
      payload: {
        blockId: Joi.string().required(),
      },
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
var RcmBlockBaseRoute =
  [
    createBlock,
    getBlock,
    updateBlock,
    getAllBlocks,
    deleteBlock
  ];
module.exports = RcmBlockBaseRoute;
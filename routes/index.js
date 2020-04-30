/**
 * Created by Navit
 */
"use strict";

var DemoBaseRoute = require("./demoRoute/demoBaseRoute");
var UserBaseRoute = require("./userRoute/userBaseRoute");
var AdminBaseRoute = require("./adminRoute/adminBaseRoute");
var UploadBaseRoute = require("./uploadRoute/uploadBaseRoute");
var RcmBlockBaseRoute = require('./rcmBlockRoute/rcmBlockBaseRoute');
var VisualizationBaseRoute = require('./visualizationRoute/visualizationBaseRoute');

var APIs = [].concat(DemoBaseRoute, UserBaseRoute, AdminBaseRoute, UploadBaseRoute, RcmBlockBaseRoute, VisualizationBaseRoute);
module.exports = APIs;

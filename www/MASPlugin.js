/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

var MASPluginMAS = require("./MASPluginMAS"),
    MASPluginUser = require("./MASPluginUser"),
    MASPluginGroup = require("./MASPluginGroup"),
    MASPluginDevice = require("./MASPluginDevice"),
    MASPluginApplication = require("./MASPluginApplication"),
    MASPluginAuthProviders = require("./MASPluginAuthProviders"),
    MASPluginMultipartForm = require("./MASPluginMultipartForm");

var MASPluginConstants = require("./MASPluginConstants");
var MASPluginSecurityConfiguration = require("./MASPluginSecurityConfiguration");

/**
* @class MASPlugin
* @hideconstructor
* @classdesc The parent MASFoundation factory class to get objects of MAS Core classes.
* @example
* <caption>To get instance of {@link MASPluginMAS} : An interface that is mapped to MAS Model of Native and controls MAS Process Lifecycle</caption>
var MAS = new MASPlugin.MAS();
* @example
* <caption>To get instance of {@link MASPluginUser} : An interface that is mapped to MASUser Model of Native and controls MASUser Lifecycle</caption>
MASPlugin.MASUser.currentUser(successHandler(theUser),errorHandler(error));
//The theUser provided in the successHandler is the final populated user received after login.
* @example
* <caption>To get instance of {@link MASPluginDevice} : An interface that is mapped to MASDevice Model of Native and controls MASDevice Lifecycle</caption>
var MASDevice = new MASPlugin.MASDevice();
* @example
* <caption>To get instance of {@link MASPluginApplication} : An interface that is mapped to MASApplication Model of Native and controls MASApplication Lifecycle</caption>
var MASApplication = new MASPlugin.MASApplication();
* @example
* <caption>To get instance of {@link MASPluginAuthProviders} : An interface that is mapped to MASAuthenticationProviders Model of Native</caption>
var MASAuthenticationProviders = new MASPlugin.MASAuthenticationProviders();
* @example
* <caption>To get instance of {@link MASPluginSecurityConfiguration} : An interface that is mapped to MASSecurityConfiguration Model of Native</caption>
var MASSecurityConfiguration = new MASPlugin.MASSecurityConfiguration();
* @example
* <caption>To get instance of {@link MASPluginMultipartForm} : An interface that is mapped to MASMultipartForm Model of Native</caption>
var MASMultipartForm = new MASPlugin.MASPluginMultipartForm();
*/
var MASPlugin = {
    MASGrantFlow: MASPluginConstants.MASGrantFlow,
    MASRequestResponseType: MASPluginConstants.MASRequestResponseType,
    MASAuthenticationStatus: MASPluginApplication.MASAuthenticationStatus,
    MAS: MASPluginMAS,
    MASUser: MASPluginUser,
    MASGroup: MASPluginGroup,    
    MASDevice: MASPluginDevice,
    MASApplication: MASPluginApplication,
    MASAuthenticationProviders: MASPluginAuthProviders,
    MASSecurityConfiguration: MASPluginSecurityConfiguration,
    MASSecuritySSLPinningMode: MASPluginConstants.MASSecuritySSLPinningMode,
    MASMultipartForm: MASPluginMultipartForm
};
    
/**
 * A user defined success callback function. The contract of the function is out of scope for Mobile SDK, but the object passed to that function by Mobile SDK will conform to a structure based on operation type.
 * @callback successCallbackFunction
 * @param {Object} result The result object can take any form. It can be an object, or a plain string, a boolean or a number based on the API.
 * <br>As an example for HTTP GET calls it will be :<br>{<br>&nbsp;&nbsp;"MASResponseInfoBodyInfoKey": "&lt;The response content&gt;",
 * <br>&nbsp;&nbsp;"MASResponseInfoHeaderInfoKey":{<br>&nbsp;&nbsp;&nbsp;&nbsp;"&lt;header name&gt;": "&lt;Header value&gt;"<br>&nbsp;&nbsp;}<br>}<br>
 * For other operations, it can be a string returning SUCCESS or TRUE or any other type<br> Developer may check for existance of result object to define success in such case and must not rely on the exact response format.
 * To know about specific result for each API see {@link http://mas.ca.com/docs/cordova/latest/guides}
 */

 /**
 * A user defined error callback function. The contract of the function is out of scope for Mobile SDK, but the object passed to that function by Mobile SDK will conform to a strict structure.
 * @callback errorCallbackFunction
 * @param {Object} error A Json Object with below structure <br>{<br>&nbsp;&nbsp;"errorCode": &lt;The error code. For ex. 3003123&gt;,<br>&nbsp;&nbsp;"errorMessage": "&lt;The error message&gt;"<br>&nbsp;&nbsp;"errorInfo":"&lt;The Error Info&gt;"<br>}<br>
 */
module.exports = MASPlugin;
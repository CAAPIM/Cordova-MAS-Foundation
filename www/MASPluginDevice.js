/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

/**
* @class MASPluginDevice
* @hideconstructor
* @classdesc The main class containing the functions for MAS Device Management.
* <table>
*	<tr bgcolor="#D3D3D3"><th>MASPluginDevice Construtor</th></tr>
*	<tr><td><i>var MASDevice = new MASPlugin.MASDevice();</i></td></tr>
* </table>
*/
var MASPluginDevice = function() {
    /**
    * Verifies whether the current device is registered on MAG server
	* @memberOf MASPluginDevice
	* @function isDeviceRegistered
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.isDeviceRegistered = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "isDeviceRegistered", []);
    };

    /**
    * Fetches the device identifier registered in MAG server. The value is a string in Base64 format.
	* @memberOf MASPluginDevice
	* @function getDeviceIdentifier
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.getDeviceIdentifier = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getDeviceIdentifier", []);
    };

    /**
    * Fetches the device's details i.e. its registration state and identifier. The response is in a form of JSON string.<br> <b> Sample : {"isRegistered":true,"identifier":"cb89kkfhhsj...jjjdj"}</b>
	* @memberOf MASPluginDevice
	* @function getCurrentDevice
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.getCurrentDevice = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getCurrentDevice", []);
    };
    
    /**
    * Deregisters a device from MAG server i.e. removes all the registration information of this device from the MAG server.
	* @memberOf MASPluginDevice
	* @function deregister
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.deregister = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "deregister", []);
    };

    /**
    * Resets all the local cache of the device for the app i.e. all  tokens, credentials, states are flushed. Do not expose this API in a production app.
	* @memberOf MASPluginDevice
	* @function resetLocally
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.resetLocally = function(successHandler, errorHandler) {
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "resetLocally", []);
    };

	/**
    * Creates or updates a new attribute for the current device. The response is SUCCESS if attribute is added successfully, else an error occurs that specifies the reason.
	* @memberOf MASPluginDevice
	* @function addAttribute
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    * @param {string} attributeName Key of the attribute to be associated with the device. Key's value should not be null or empty.
    * @param {string} attributeValue Value of the attribute to be associated with the device.
    */
    this.addAttribute = function(successHandler,errorHandler,attributeName,attributeValue){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "addAttribute", [attributeName,attributeValue]);
    };

	/**
    * Remove attribute by name, succeed even if device attribute does not exists. The response is SUCCESS if attribute removed successfully, else an error specifying the reason.
	* @memberOf MASPluginDevice
	* @function removeAttribute
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    * @param {string} attributeName Key of the attribute to be associated with the device. Key's value should not be null or empty.
    */
    this.removeAttribute = function(successHandler,errorHandler,attributeName){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "removeAttribute", [attributeName]);
    };

	/**
    * Remove all attributes for the current device. The response is SUCCESS if all attributes removed successfully, else an error specifying the reason.
	* @memberOf MASPluginDevice
	* @function removeAllAttributes
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.removeAllAttributes = function(successHandler,errorHandler){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "removeAllAttributes", []);
    };

	/**
    * Gets attribute by name, returns empty JSONObject if no attribute is found.<br>  <b> Sample: If k1 key exists, then the response will be : {"k1":"v1"}</b>
	* @memberOf MASPluginDevice
	* @function getAttribute
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    * @param {string} attributeName Key of the attribute to be associated with the device. Key should not be null or empty.
    */
    this.getAttribute = function(successHandler,errorHandler,attributeName){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getAttribute", [attributeName]);
    };

	/**
    * Gets all the attributes for the device, returns empty JSONArray if no attributes found.<br> <b>Sample: if multiple attribute pair exists then the response will be : [{"k1":"v1"},{"k2":"v2"}] </b>
	* @memberOf MASPluginDevice
	* @function getAttributes
	* @instance
    * @param {successCallbackFunction} successHandler user defined success callback that is invoked on success scenario.
    * @param {errorCallbackFunction} errorHandler user defined error callback that is invoked on failure scenario.
    */
    this.getAttributes = function(successHandler,errorHandler){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getAttributes", []);
    };
}

module.exports = MASPluginDevice;
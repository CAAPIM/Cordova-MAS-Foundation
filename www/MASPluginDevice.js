/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginDevice = function() {

    
    ///------------------------------------------------------------------------------------------------------------------
    /// @name Properties
    ///------------------------------------------------------------------------------------------------------------------

    /**
    *   Boolean state of device registration status on MAG server
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.isDeviceRegistered = function(successHandler, errorHandler) {
        
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "isDeviceRegistered", []);
    };

    /**
    *  Fetches the device identifier registered in MAG server
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.getDeviceIdentifier = function(successHandler, errorHandler) {
        
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getDeviceIdentifier", []);
    };


    ///------------------------------------------------------------------------------------------------------------------
    /// @name Current Device
    ///------------------------------------------------------------------------------------------------------------------

    /**
    * Fetches the device registration state and identifier as JSON string
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.getCurrentDevice = function(successHandler, errorHandler) {
        
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getCurrentDevice", []);
    };
    
    /**
    * Deregisters a device from MAG server i.e. remove all registration information of this device from server
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.deregister = function(successHandler, errorHandler) {
        
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "deregister", []);
    };

    /**
    * Resets all the local cache of the device for the app i.e. all  tokens, credentials, states are flushed
    *   @param {function} successHandler user defined success callback
    *   @param {function} errorHandler user defined error callback
    */
    this.resetLocally = function(successHandler, errorHandler) {
        
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "resetLocally", []);
    };

	/**
    * Create or update a new attribute for the current device. The response is SUCCESS if attribute added successfully, else an error specifying the reason.
    * @param {function} successHandler user defined success callback
    * @param {function} errorHandler user defined error callback
    * @param {string} attributeName Key of the attribute to be associated with the device. Key should not be null or empty.
    * @param {string} attributeValue Value of the attribute to be associated with the device.
    */
    this.addAttribute = function(successHandler,errorHandler,attributeName,attributeValue){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "addAttribute", [attributeName,attributeValue]);
    };

	/**
    * Remove attribute by name, succeed even if device attribute does not exists. The response is SUCCESS if attribute removed successfully, else an error specifying the reason.
    * @param {function} successHandler user defined success callback
    * @param {function} errorHandler user defined error callback
    * @param {string} attributeName Key of the attribute to be associated with the device. Key should not be null or empty.
    */
    this.removeAttribute = function(successHandler,errorHandler,attributeName){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "removeAttribute", [attributeName]);
    };

	/**
    * Remove all attributes for the current device. The response is SUCCESS if all attributes removed successfully, else an error specifying the reason.
    * @param {function} successHandler user defined success callback
    * @param {function} errorHandler user defined error callback
    */
    this.removeAllAttributes = function(successHandler,errorHandler){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "removeAllAttributes", []);
    };

	/**
    * Get attribute by name, return empty JSONObject if no attribute is found.<br> Sample: For a key=k1, if exists the response will be <br> {"k1":"v1"}
    * @param {function} successHandler user defined success callback
    * @param {function} errorHandler user defined error callback
    * @param {string} attributeName Key of the attribute to be associated with the device. Key should not be null or empty.
    */
    this.getAttribute = function(successHandler,errorHandler,attributeName){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getAttribute", [attributeName]);
    };

	/**
    * Get all attributes for the device, return empty JSONArray if no attributes found.<br> Sample: if multiple attribute pair exists then the response will be <br> [{"k1":"v1"},{"k2":"v2"}]
    * @param {function} successHandler user defined success callback
    * @param {function} errorHandler user defined error callback
    */
    this.getAttributes = function(successHandler,errorHandler){
        return Cordova.exec(successHandler, errorHandler, "MASPluginDevice", "getAttributes", []);
    };
}

module.exports = MASPluginDevice;
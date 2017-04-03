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
}

module.exports = MASPluginDevice;